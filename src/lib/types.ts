import type { OrderStatus } from "@/lib/constants";

export type ProductSize = {
  label: string;
  price: number;
};

export type CategoryDTO = {
  _id: string;
  name: string;
  slug: string;
  productCount?: number;
  image?: string;
  createdAt?: string;
};

export type ProductDTO = {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: CategoryDTO | string;
  sizes: ProductSize[];
  inStock: boolean;
  createdAt?: string;
};

export type CartItem = {
  productId: string;
  title: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
};

export type OrderItem = {
  product: string;
  title: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
};

export type OrderDTO = {
  _id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
};
