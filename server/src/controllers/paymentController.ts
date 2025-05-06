import { Request, Response } from 'express';
import Stripe from 'stripe';
import { db } from '../config/database';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.error("FATAL ERROR: STRIPE_SECRET_KEY is not set.");
  process.exit(1);
}
const stripe = new Stripe(stripeSecret);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
  console.warn("STRIPE_WEBHOOK_SECRET is not set. Webhook signature verification may fail if not using Stripe CLI forwarding.");
}

export async function createPaymentIntent(req: Request, res: Response): Promise<void> {
  try {
    const { items, userId, shippingAddress } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Invalid cart items' });
      return;
    }
    // calculate amount
    const amount = Math.round(
      items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0) * 100
    );
    // create pending order in DB
    const order = await db.one(
      `INSERT INTO orders (user_id, status, total_amount, shipping_address, items, created_at, updated_at)
       VALUES ($1, 'pending', $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id`,
      [userId || null, amount / 100, shippingAddress, JSON.stringify(items)]
    );
    // create stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      metadata: { order_id: order.id.toString() }
    });
    // save payment intent id
    await db.none(
      `UPDATE orders SET payment_intent_id = $1 WHERE id = $2`,
      [paymentIntent.id, order.id]
    );
    // respond with client secret and orderId
    res.json({ clientSecret: paymentIntent.client_secret, orderId: order.id });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
}

export async function handleWebhook(req: Request, res: Response): Promise<void> {
  const sig = req.headers['stripe-signature'] as string;

  if (!webhookSecret) {
    console.error("Webhook secret is not configured on the server.");
    res.status(500).send("Webhook secret not configured on the server.");
    return;
  }
  if (!sig) {
     console.warn("Webhook request is missing the Stripe-Signature header.");
     res.status(400).send("Missing Stripe-Signature header.");
     return;
 }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      console.log(`Webhook: payment_intent.succeeded for ${event.data.object.id}`);
      break;
    }
    case 'payment_intent.payment_failed': {
      console.log(`Webhook: payment_intent.payment_failed for ${event.data.object.id}`);
      break;
    }
    default:
      console.log(`Webhook: unhandled event type ${event.type}`);
  }
  res.json({ received: true });
}

// Helper: reduce product stock after payment
async function updateInventoryForOrder(orderId: number): Promise<void> {
  const record = await db.oneOrNone('SELECT items FROM orders WHERE id = $1', [orderId]);
  if (!record || !record.items) return;
  let items: Array<{ id: number; quantity: number }>;
  if (typeof record.items === 'string') {
    items = JSON.parse(record.items);
  } else {
    items = record.items;
  }
  for (const item of items) {
    await db.none(
      `UPDATE products SET stock = GREATEST(stock - $1, 0), updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [item.quantity, item.id]
    );
  }
}

// Finalize order: update status and reduce inventory, called from client after payment succeeds
export async function finalizeOrder(req: Request, res: Response): Promise<void> {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      res.status(400).json({ error: 'Missing orderId' });
      return;
    }
    // update existing pending order to completed
    const result = await db.none(
      `UPDATE orders SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND status = 'pending'`,
      [orderId]
    );
    // reduce inventory
    await updateInventoryForOrder(orderId);
    res.json({ success: true, orderId });
  } catch (error: any) {
    console.error('Error finalizing order:', error);
    res.status(500).json({ error: error.message || 'Failed to finalize order' });
  }
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  try {
    const idParam = req.params.id;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid order id' });
      return;
    }
    const order = await db.oneOrNone('SELECT * FROM orders WHERE id = $1', [id]);

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}

// Fetch orders for current user
export async function getOrdersByUser(req: Request, res: Response): Promise<void> {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const orders = await db.any(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
    [user.id]
  );
  res.json(orders);
}