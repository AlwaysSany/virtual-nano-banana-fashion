
import { Product, Category } from './types';

export const CATEGORIES: { id: Category; name: string }[] = [
  { id: 'all', name: 'All' },
  { id: 'shirts', name: 'Shirts' },
  { id: 'pants', name: 'Pants' },
  { id: 'shoes', name: 'Shoes' },
  { id: 'outerwear', name: 'Outerwear' },
  { id: 'hats', name: 'Hats' },
  { id: 'eyewear', name: 'Eyewear' },
];

export const PRODUCTS: Product[] = [
  // Outerwear
  { id: 1,  name: 'Classic gray jacket', category: 'outerwear', price: '$69.99', imageSrc: '/assets/Classic gray jacket.jpg' },
  { id: 2,  name: 'Lee 101 Storm Rider Lined Denim Jacket - Classic Fit', category: 'outerwear', price: '$119.99', imageSrc: '/assets/Lee 101 Storm Rider Lined Denim Jacket - Classic Fit.jpg' },
  { id: 3,  name: 'Chic Black Faux Leather Biker Jacket', category: 'outerwear', price: '$149.99', imageSrc: '/assets/Chic Black Faux Leather Biker Jacket.jpg' },
  { id: 4,  name: 'Olive jacket for winter', category: 'outerwear', price: '$129.99', imageSrc: '/assets/Olive jacket for winter.jpg' },

  // Eyewear
  { id: 5,  name: 'Chic Nude Cat-Eye Sunglasses', category: 'eyewear', price: '$89.99', imageSrc: '/assets/Chic Nude Cat-Eye Sunglasses.jpg' },
  { id: 6,  name: 'Classic Browline Sunglasses | Gradient UV Lenses', category: 'eyewear', price: '$99.99', imageSrc: '/assets/Classic Browline Sunglasses | Gradient UV Lenses.jpg' },
  { id: 7,  name: 'Classic Mirrored Clubmaster Sunglasses | UV Protection', category: 'eyewear', price: '$109.99', imageSrc: '/assets/Classic Mirrored Clubmaster Sunglasses | UV Protection.jpg' },
  { id: 8,  name: 'Iconic Ray-Ban Wayfarer P Polarized Sunglasses', category: 'eyewear', price: '$159.99', imageSrc: '/assets/Iconic Ray-Ban Wayfarer P Polarized Sunglasses.jpg' },
  { id: 9,  name: 'Ray-Ban Aviator Classic Gold Frame Gradient', category: 'eyewear', price: '$149.99', imageSrc: '/assets/Ray-Ban Aviator Classic Gold Frame Gradient.jpg' },
  { id: 10, name: 'Modern Black Frame Round Eyeglasses', category: 'eyewear', price: '$79.99', imageSrc: '/assets/Modern Black Frame Round Eyeglasses.jpg' },
  { id: 11, name: 'Minimalist Desk Setup: Apple Keyboard, Mouse & Ray-Bans', category: 'eyewear', price: '$49.99', imageSrc: '/assets/Minimalist Desk Setup: Apple Keyboard, Mouse & Ray-Bans.jpg' },

  // Hats
  { id: 12, name: 'Classic White Flat Brim Cap - Blank & Customizable', category: 'hats', price: '$24.99', imageSrc: '/assets/Classic White Flat Brim Cap - Blank & Customizable.jpg' },
  { id: 13, name: 'Dope Embroidered Blue Snapback Cap | Urban Style Headwear', category: 'hats', price: '$29.99', imageSrc: '/assets/Dope Embroidered Blue Snapback Cap | Urban Style Headwear.jpg' },
  { id: 14, name: 'Gray Stylish Cap', category: 'hats', price: '$21.99', imageSrc: '/assets/Gray Stylish Cap.jpg' },
  { id: 15, name: 'Olive hat with black streep', category: 'hats', price: '$22.99', imageSrc: '/assets/Olive hat with black streep.jpg' },
  { id: 16, name: 'Plain white cap', category: 'hats', price: '$19.99', imageSrc: '/assets/Plain white cap.jpg' },
  { id: 17, name: 'RVCA Grey Logo Trucker Cap - Adjustable Mesh Snapback', category: 'hats', price: '$27.99', imageSrc: '/assets/RVCA Grey Logo Trucker Cap - Adjustable Mesh Snapback.jpg' },
  { id: 18, name: 'Rust Mountain Landscape Cap', category: 'hats', price: '$25.99', imageSrc: '/assets/Rust Mountain Landscape Cap.jpg' },
  { id: 19, name: 'Vintage black cap', category: 'hats', price: '$23.99', imageSrc: '/assets/Vintage black cap.jpg' },

  // Shoes
  { id: 20, name: 'Classic Nike Air Force 1 Low Black White Sneakers', category: 'shoes', price: '$129.99', imageSrc: '/assets/Classic Nike Air Force 1 Low Black White Sneakers.jpg' },
  { id: 21, name: 'Dynamic Multi-Color Chunky Sneakers | Bold Fashion Footwear', category: 'shoes', price: '$139.99', imageSrc: '/assets/Dynamic Multi-Color Chunky Sneakers | Bold Fashion Footwear.jpg' },
  { id: 22, name: 'Light green Shoe', category: 'shoes', price: '$89.99', imageSrc: '/assets/Light green Shoe.jpg' },
  { id: 23, name: 'New Balance 247 Olive Green REVlite Lifestyle Sneaker', category: 'shoes', price: '$149.99', imageSrc: '/assets/New Balance 247 Olive Green REVlite Lifestyle Sneaker.jpg' },
  { id: 24, name: 'Pink white sneakers', category: 'shoes', price: '$99.99', imageSrc: '/assets/Pink white sneakers.jpg' },
  { id: 25, name: 'Sleek Black Performance Trainer | Dynamic Comfort & Support', category: 'shoes', price: '$119.99', imageSrc: '/assets/Sleek Black Performance Trainer | Dynamic Comfort & Support.jpg' },
  { id: 26, name: 'The Puma sneakers', category: 'shoes', price: '$159.99', imageSrc: '/assets/The Puma sneakers.jpg' },
  { id: 27, name: 'Vibrant Orange Converse Chuck 70 High-Top Sneaker', category: 'shoes', price: '$139.99', imageSrc: '/assets/Vibrant Orange Converse Chuck 70 High-Top Sneaker.jpg' },

  // Newly added Apparel — Shirts (T-shirts)
  { id: 28, name: 'Light Yellow Tshirt', category: 'shirts', price: '$24.99', imageSrc: '/assets/Light Yellow Tshirt.jpg' },
  { id: 29, name: 'Purple friends forever tshirt', category: 'shirts', price: '$19.99', imageSrc: '/assets/Purple friends forever tshirt.jpg' },
  { id: 30, name: 'Red cartoon Tshirt', category: 'shirts', price: '$21.99', imageSrc: '/assets/Red cartoon Tshirt.jpg' },
  { id: 31, name: 'White Bheem Tshirt', category: 'shirts', price: '$22.99', imageSrc: '/assets/White Bheem Tshirt.jpg' },
  { id: 32, name: 'Yellow Warrior Tshirt', category: 'shirts', price: '$21.99', imageSrc: '/assets/Yellow Warrior Tshirt.jpg' },

  // Newly added Apparel — Pants (Jeans)
  { id: 33, name: 'Formal Jeans', category: 'pants', price: '$59.99', imageSrc: '/assets/Formal Jeans.jpg' },
  { id: 34, name: 'Funky blue jeans', category: 'pants', price: '$49.99', imageSrc: '/assets/Funky blue jeans.jpg' },
  { id: 35, name: 'Gray Jeans', category: 'pants', price: '$54.99', imageSrc: '/assets/Gray Jeans.jpg' },
  { id: 36, name: 'Slim Fit Jeans', category: 'pants', price: '$64.99', imageSrc: '/assets/Slim Fit Jeans.jpg' },
  { id: 37, name: 'TIght Fit Jeans', category: 'pants', price: '$64.99', imageSrc: '/assets/TIght Fit Jeans.jpg' },
  { id: 38, name: 'Yello Funky Jeans', category: 'pants', price: '$44.99', imageSrc: '/assets/Yello Funky Jeans.jpg' },
  { id: 39, name: 'Army Mobile pant', category: 'pants', price: '$39.99', imageSrc: '/assets/Army Mobile pant.jpg' },

  // Additional outerwear discovered
  { id: 40, name: 'Black Leather Jacket', category: 'outerwear', price: '$179.99', imageSrc: '/assets/Black Leather Jacket.jpg' },
];
