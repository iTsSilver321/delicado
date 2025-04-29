export interface Product {
    id: number;
    name: string;
    description: string;
    price: number; // Ensure this is treated as number
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