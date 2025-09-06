
export type Category =
  | 'all'
  | 'shirts'
  | 'pants'
  | 'shoes'
  | 'outerwear'
  | 'hats'
  | 'eyewear'
  | 'combined'

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: string;
  imageSrc: string; // asset path
}
