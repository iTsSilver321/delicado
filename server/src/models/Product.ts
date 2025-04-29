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
    created_at: Date;
    updated_at: Date;
  }
  
  export interface CreateProductDTO {
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    stock: number;
    dimensions?: string;
    material?: string;
    care?: string;
  }