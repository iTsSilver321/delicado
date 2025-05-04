export interface DesignTemplate {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: string;
  applicable_products: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateDesignTemplateDTO {
  name: string;
  description: string;
  image_url: string;
  category: string;
  applicable_products: string[];
}