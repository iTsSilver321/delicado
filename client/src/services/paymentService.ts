import api from '../config/api';
import { CartItem, Order } from '../types';

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  orderId: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Extended shipping info including method and cost
export interface ShippingInfo extends ShippingAddress {
  shippingMethod: string;
  shippingCost: number;
}

export const paymentService = {
  createPaymentIntent(items: CartItem[], userId?: number, shippingInfo?: ShippingInfo): Promise<CreatePaymentIntentResponse> {
    return api.post('/payments/create-payment-intent', {
      items,
      userId,
      shippingAddress: shippingInfo
    }).then(response => response.data);
  },
  
  getOrderById(id: number): Promise<any> {
    return api.get(`/payments/orders/${id}`).then(response => response.data);
  },

  // Fetch orders for the logged-in user
  getOrdersByUser(): Promise<Order[]> {
    return api.get('/payments/user').then(response =>
      response.data.map((o: any) => ({
        id: o.id,
        user_id: o.user_id,
        items: o.items,
        total: Number(o.total_amount),
        status: o.status,
        created_at: o.created_at,
        shipping_address: o.shipping_address
      }))
    );
  },

  // Create cash-on-delivery order without Stripe
  createCashOrder(items: CartItem[], userId?: number, shippingInfo?: ShippingInfo): Promise<{ orderId: number }> {
    return api.post('/payments/cash-order', {
      items,
      userId,
      shippingAddress: shippingInfo
    }).then(response => response.data);
  },

  // Finalize order after client confirms payment
  finalizeOrder(orderId: number): Promise<{ success: boolean }> {
    return api.post('/payments/finalize-order', { orderId })
      .then(response => response.data);
  }
};