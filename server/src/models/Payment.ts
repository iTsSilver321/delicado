export interface PaymentIntent {
  id: string;
  amount: number;
  client_secret: string;
  currency: string;
  order_id?: number;
  status: string;
  created_at: Date;
}

export interface Order {
  id: number;
  user_id: number | null;
  payment_intent_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  total_amount: number;
  shipping_address: any;
  items: any[];
  created_at: Date;
  updated_at: Date;
}