export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; 
  category: string;
  image_url: string;
  stock: number;
  dimensions?: string;
  material?: string;
  care?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem extends Product {
  quantity: number;
  personalization?: PersonalizationConfig;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  shipping_addresses?: any;
  is_admin: boolean;
}

export interface Order {
  id: number;
  user_id: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
  shipping_address: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

// New interfaces for personalization
export interface DesignTemplate {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: string;
  applicable_products: number[]; // Product IDs this template can be applied to
}

export interface TextOption {
  font: string;
  size: number;
  color: string;
  position: {
    x: number;
    y: number;
  };
}

export interface PersonalizationConfig {
  productId: number;
  templateId: number;
  customText?: string;
  textOptions?: TextOption;
  previewUrl?: string; // URL to the generated preview image
}

export interface OrderAdmin {
  id: number;
  user_id: number | null;
  email?: string | null;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  total_amount: number;
  created_at: string;
}

export interface UserAdmin {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  shipping_addresses?: any;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}