// model/Product.models.ts

export interface CreateProductInput {
  name: string;
  brand?: string;
  type?: string;
  description?: string;
  price?: number;
  stock?: string;
  imageUrl?: string;
  notes?: string;
  longevity?: string;
  sillage?: string;
  projection?: string;
  usage_time?: string;
  blind_buy_safe?: boolean;
}

// Untuk update, semua field opsional (Partial dari Create)
export interface UpdateProductInput extends Partial<CreateProductInput> {}