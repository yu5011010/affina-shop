export type Role = "user" | "owner" | "seller";

export type ProductRecord = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  stock: number;
  is_active: boolean;
  created_at?: string | null;
};

export type ProfileRecord = {
  id: string;
  email: string;
  display_name: string | null;
  role: Role;
  created_at?: string | null;
  updated_at?: string | null;
};

export type CartEntry = {
  productId: string;
  quantity: number;
};

export type CartLine = {
  product: ProductRecord;
  quantity: number;
  subtotal: number;
};
