export interface TextOptions {
  font: string;
  size: number;
  color: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Personalization {
  id: number;
  product_id: number;
  template_id: number | null;
  custom_text?: string;
  text_options?: TextOptions;
  preview_url?: string;
  user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePersonalizationDTO {
  product_id: number;
  template_id?: number;
  custom_text?: string;
  text_options?: TextOptions;
  preview_url?: string;
  user_id?: number;
}