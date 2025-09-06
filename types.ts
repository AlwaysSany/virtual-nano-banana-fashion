
export type Category =
  | 'all'
  | 'shirts'
  | 'pants'
  | 'shoes'
  | 'accessories'
  | 'outerwear'
  | 'hats'
  | 'eyewear'
  | 'models';

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: string;
  imageSrc: string; // asset path
}
