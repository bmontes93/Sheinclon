export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  imageUrl: string;
  images?: string[];
  stock: number;
  sizes?: { size: string; stock: number; sku?: string }[];
  colors?: { name: string; hexCode?: string; stock: number }[];
  selectedSize?: string;
  selectedColor?: string;
  quantity?: number;
  rating?: number;
  numReviews?: number;
}
