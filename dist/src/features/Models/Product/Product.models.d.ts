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
export interface UpdateProductInput extends Partial<CreateProductInput> {
}
//# sourceMappingURL=Product.models.d.ts.map