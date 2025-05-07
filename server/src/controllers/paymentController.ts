import { Request, Response } from 'express';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
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

// Setup email transporter using env vars
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

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
    // prepare JSON strings for idempotency
    const itemsJson = JSON.stringify(items);
    const shippingJson = JSON.stringify(shippingAddress);
    const totalAmount = amount / 100;
    // check for existing pending order with same details
    const existing = await db.oneOrNone(
      `SELECT id, payment_intent_id FROM orders WHERE status = 'pending' AND user_id = $1 AND items::text = $2 AND shipping_address::text = $3 AND total_amount = $4`,
      [userId || null, itemsJson, shippingJson, totalAmount]
    );
    if (existing && existing.payment_intent_id) {
      // reuse existing Stripe PaymentIntent
      const pi = await stripe.paymentIntents.retrieve(existing.payment_intent_id);
      res.json({ clientSecret: pi.client_secret, orderId: existing.id });
      return;
    }
    // create pending order in DB
    const order = await db.one(
      `INSERT INTO orders (user_id, status, total_amount, shipping_address, items, created_at, updated_at)
       VALUES ($1, 'pending', $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id`,
      [userId || null, totalAmount, JSON.stringify(shippingAddress), itemsJson]
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

// Create cash-on-delivery order endpoint
export async function createCashOrder(req: Request, res: Response): Promise<void> {
  try {
    const { items, userId, shippingAddress } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Invalid cart items' });
      return;
    }

    // Prepare JSON strings for comparison
    const shippingJson = JSON.stringify(shippingAddress);
    const itemsJson = JSON.stringify(items);

    // Check for existing pending order with same payload
    const existing = await db.oneOrNone(
      `SELECT id FROM orders WHERE status = 'pending' AND user_id = $1 AND shipping_address::text = $2 AND items::text = $3`,
      [userId || null, shippingJson, itemsJson]
    );
    if (existing) {
      // Return existing pending order
      res.json({ orderId: existing.id });
      return;
    }

    // Calculate items total
    const itemsTotal = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
    // Add shipping cost if present
    const shippingCost = shippingAddress?.shippingCost || 0;
    const totalAmount = itemsTotal + shippingCost;

    // Insert order into DB with status 'pending'
    const order = await db.one(
      `INSERT INTO orders (user_id, status, total_amount, shipping_address, items, created_at, updated_at)
       VALUES ($1, 'pending', $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id`,
      [
        userId || null,
        totalAmount,
        JSON.stringify(shippingAddress),  // stringify for JSONB
        JSON.stringify(items)             // stringify for JSONB
      ]
    );

    // Send confirmation email if user exists
    if (userId) {
      try {
        const userRecord = await db.one('SELECT email, first_name FROM users WHERE id = $1', [userId]);
        // create transporter (use Ethereal test account if no SMTP config)
        const { transporter: sendTr, account } = process.env.SMTP_HOST ?
          { transporter, account: null } :
          await (async () => {
            const testAcc = await nodemailer.createTestAccount();
            const tr = nodemailer.createTransport({
              host: testAcc.smtp.host,
              port: testAcc.smtp.port,
              secure: testAcc.smtp.secure,
              auth: { user: testAcc.user, pass: testAcc.pass }
            });
            console.log('Ethereal test account created:', testAcc.user);
            return { transporter: tr, account: testAcc };
          })();
        const info = await sendTr.sendMail({
          from: process.env.EMAIL_FROM || 'no-reply@delicado.com',
          to: userRecord.email,
          subject: `Order Confirmation - #${order.id}`,
          html: `<p>Hi ${userRecord.first_name},</p>
                 <p>Your cash-on-delivery order <strong>#${order.id}</strong> has been received! We will contact you with delivery details.</p>
                 <p>Order Total: €${totalAmount.toFixed(2)}</p>
                 <p>Thank you for shopping with Delicado.</p>`
        });
        if (account) {
          console.log('Cash order confirmation email preview URL:', nodemailer.getTestMessageUrl(info));
        }
      } catch (mailErr) {
        console.error('Error sending cash order confirmation email:', mailErr);
        // proceed without blocking order creation
      }
    }
    res.json({ orderId: order.id });
  } catch (error: any) {
    console.error('Error creating cash order:', error);
    res.status(500).json({ error: error.message || 'Failed to create cash order' });
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

    // Fetch order and user email for confirmation
    const order = await db.one('SELECT user_id FROM orders WHERE id = $1', [orderId]);
    if (order.user_id) {
      try {
        const userRecord = await db.one('SELECT email, first_name FROM users WHERE id = $1', [order.user_id]);
        // email via Ethereal or real SMTP
        const { transporter: sendTr2, account: acc2 } = process.env.SMTP_HOST ?
          { transporter, account: null } :
          await (async () => {
            const testAcc2 = await nodemailer.createTestAccount();
            const tr2 = nodemailer.createTransport({
              host: testAcc2.smtp.host,
              port: testAcc2.smtp.port,
              secure: testAcc2.smtp.secure,
              auth: { user: testAcc2.user, pass: testAcc2.pass }
            });
            console.log('Ethereal test account created:', testAcc2.user);
            return { transporter: tr2, account: testAcc2 };
          })();
        const info2 = await sendTr2.sendMail({
          from: process.env.EMAIL_FROM || 'no-reply@delicado.com',
          to: userRecord.email,
          subject: `Order Confirmation - #${orderId}`,
          html: `<p>Hi ${userRecord.first_name},</p>
                 <p>Thank you for your order <strong>#${orderId}</strong>! We have received your payment and are now processing your purchase.</p>
                 <p>You can view your order details <a href="${process.env.FRONTEND_URL}/order-confirmation/${orderId}">here</a>.</p>
                 <p>Best regards,<br/>Delicado Team</p>`
        });
        if (acc2) console.log('Card order confirmation email preview URL:', nodemailer.getTestMessageUrl(info2));
      } catch (mailErr) {
        console.error('Error sending order confirmation email:', mailErr);
        // continue without failing
      }
    }

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