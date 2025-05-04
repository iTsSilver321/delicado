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
  firstName: string;
  lastName: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress: User['address'];
}

// New interfaces for personalization
export interface DesignTemplate {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: string;
  applicable_products: string[]; // Categories or product IDs this template can be applied to
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