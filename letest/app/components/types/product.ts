export interface Product {
  _id: string;
  name: string;
  slug: string;          // Crucial for SEO-friendly URLs (e.g., /product/nike-air-max)
  description: string;   // Essential for product details pages
  price: number;
  discountPrice?: number; // Allows for sale badges (e.g., 99.99 vs 79.99)
  images: string[];
  stock: number;
  category: string;
  brand?: string;        // Great for filtering and sidebar navigation
  rating: number;
  numReviews: number;    // Essential to calculate/display "4.5 (120 reviews)"
  isPublished: boolean;  // Administrative toggle to hide/show products
  createdAt: string;     // ISO Date for "New Arrivals" sorting
  updatedAt: string;
}