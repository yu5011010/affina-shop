import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { CartEntry, CartLine, ProductRecord, ProfileRecord } from "@/lib/types";

export const CART_COOKIE = "ec-demo-cart";

function parseCart(raw: string | undefined): CartEntry[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry) => {
        if (
          typeof entry === "object" &&
          entry !== null &&
          "productId" in entry &&
          "quantity" in entry &&
          typeof entry.productId === "string" &&
          typeof entry.quantity === "number"
        ) {
          return {
            productId: entry.productId,
            quantity: entry.quantity,
          };
        }

        return null;
      })
      .filter((entry): entry is CartEntry => Boolean(entry));
  } catch {
    return [];
  }
}

export async function getProducts() {
  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, owner_id, name, description, price, image_url, category, stock, is_active, created_at",
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as ProductRecord[];
}

export async function getProductById(id: string) {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, owner_id, name, description, price, image_url, category, stock, is_active, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[getProductById]", id, error.message, error.code);
    }
    return null;
  }

  if (!data) {
    return null;
  }

  return data as ProductRecord;
}

export async function getCurrentProfile() {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, email, display_name, role, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  return (data as ProfileRecord | null) ?? null;
}

export async function getOwnerProducts(ownerId: string) {
  const products = await getProducts();

  return products.filter((product) => product.owner_id === ownerId);
}

export async function getOwnerProductById(ownerId: string, productId: string) {
  const product = await getProductById(productId);

  if (!product || product.owner_id !== ownerId) {
    return null;
  }

  return product;
}

export async function getCartLines() {
  const supabase = await createClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("cart_items")
        .select(
          "id, quantity, product_id, products:products(id, owner_id, name, description, price, image_url, category, stock, is_active, created_at)",
        )
        .eq("user_id", user.id);

      if (!error && data) {
        return data
          .map((row) => {
            const relation = row.products as ProductRecord | ProductRecord[] | null;
            const product = Array.isArray(relation) ? relation[0] : relation;

            if (!product) {
              return null;
            }

            return {
              product,
              quantity: row.quantity,
              subtotal: product.price * row.quantity,
            };
          })
          .filter((line): line is CartLine => Boolean(line));
      }
    }
  }

  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE)?.value;
  const entries = parseCart(raw);
  const products = await getProducts();
  const productMap = new Map(products.map((product) => [product.id, product]));

  return entries
    .map((entry) => {
      const product = productMap.get(entry.productId);

      if (!product) {
        return null;
      }

      return {
        product,
        quantity: entry.quantity,
        subtotal: product.price * entry.quantity,
      };
    })
    .filter((line): line is CartLine => Boolean(line));
}

export async function getCartSummary() {
  const lines = await getCartLines();
  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const quantity = lines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    lines,
    total,
    quantity,
  };
}

export function serializeCart(entries: CartEntry[]) {
  return JSON.stringify(
    entries.filter((entry) => entry.quantity > 0).map((entry) => ({
      productId: entry.productId,
      quantity: entry.quantity,
    })),
  );
}

export function mergeCartEntry(entries: CartEntry[], productId: string, quantity: number) {
  const current = entries.find((entry) => entry.productId === productId);

  if (current) {
    current.quantity += quantity;
    return entries;
  }

  return [...entries, { productId, quantity }];
}

export function replaceCartEntry(
  entries: CartEntry[],
  productId: string,
  quantity: number,
) {
  return entries
    .map((entry) =>
      entry.productId === productId ? { ...entry, quantity } : entry,
    )
    .filter((entry) => entry.quantity > 0);
}

export function removeCartEntry(entries: CartEntry[], productId: string) {
  return entries.filter((entry) => entry.productId !== productId);
}

export async function getCookieCartEntries() {
  const cookieStore = await cookies();
  return parseCart(cookieStore.get(CART_COOKIE)?.value);
}
