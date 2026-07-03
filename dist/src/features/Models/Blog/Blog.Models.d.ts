export interface BlogCreateInput {
    title: string;
    content: string;
    excerpt: string;
    category?: string;
    author?: string;
    approval?: boolean;
    likes?: number;
    imageUrl?: string;
    imageUrl2?: string;
    imageUrl3?: string;
    publishDate?: Date;
}
export interface BlogUpdateInput extends Partial<BlogCreateInput> {
}
//# sourceMappingURL=Blog.Models.d.ts.map