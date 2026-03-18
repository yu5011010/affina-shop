"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  CART_COOKIE,
  getCartSummary,
  getCookieCartEntries,
  mergeCartEntry,
  removeCartEntry,
  replaceCartEntry,
  serializeCart,
} from "@/lib/store";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function setCookieCart(value: string) {
  const cookieStore = await cookies();

  cookieStore.set(CART_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

async function clearCookieCart() {
  const cookieStore = await cookies();

  cookieStore.set(CART_COOKIE, "[]", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function signUpAction(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/register?error=Supabase%20is%20not%20configured");
  }

  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const displayName = getString(formData, "displayName");
  const role = getString(formData, "role") === "owner" ? "owner" : "user";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    await supabase
      .from("profiles")
      .update({
        display_name: displayName || null,
        role,
      })
      .eq("id", data.user.id);
  }

  redirect("/");
}

export async function signInAction(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/login?error=Supabase%20is%20not%20configured");
  }

  const email = getString(formData, "email");
  const password = getString(formData, "password");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

export async function signOutAction() {
  const supabase = await createClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}

export async function addToCartAction(formData: FormData) {
  const productId = getString(formData, "productId");
  const quantity = Number(formData.get("quantity") ?? 1);
  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
  const supabase = await createClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + safeQuantity })
          .eq("id", existing.id);
      } else {
        await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          quantity: safeQuantity,
        });
      }

      revalidatePath("/");
      revalidatePath("/cart");
      revalidatePath(`/products/${productId}`);
      redirect("/cart");
    }
  }

  const entries = await getCookieCartEntries();
  const next = mergeCartEntry(entries, productId, safeQuantity);

  await setCookieCart(serializeCart(next));
  revalidatePath("/");
  revalidatePath("/cart");
  redirect("/cart");
}

export async function updateCartItemAction(formData: FormData) {
  const productId = getString(formData, "productId");
  const quantity = Number(formData.get("quantity") ?? 1);
  const safeQuantity = Number.isFinite(quantity) ? Math.max(0, quantity) : 1;
  const supabase = await createClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      if (safeQuantity === 0) {
        await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
      } else {
        await supabase
          .from("cart_items")
          .update({ quantity: safeQuantity })
          .eq("user_id", user.id)
          .eq("product_id", productId);
      }

      revalidatePath("/cart");
      redirect("/cart");
    }
  }

  const entries = await getCookieCartEntries();
  const next = replaceCartEntry(entries, productId, safeQuantity);

  await setCookieCart(serializeCart(next));
  revalidatePath("/cart");
  redirect("/cart");
}

export async function removeCartItemAction(formData: FormData) {
  const productId = getString(formData, "productId");
  const supabase = await createClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      revalidatePath("/cart");
      redirect("/cart");
    }
  }

  const entries = await getCookieCartEntries();
  const next = removeCartEntry(entries, productId);

  await setCookieCart(serializeCart(next));
  revalidatePath("/cart");
  redirect("/cart");
}

export async function checkoutAction(formData: FormData) {
  const fullName = getString(formData, "fullName");
  const address = getString(formData, "address");
  const postalCode = getString(formData, "postalCode");
  const summary = await getCartSummary();

  if (summary.lines.length === 0) {
    redirect("/cart");
  }

  const supabase = await createClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "pending",
          total_amount: summary.total,
          shipping_address: {
            full_name: fullName,
            address,
            postal_code: postalCode,
          },
        })
        .select("id")
        .single();

      if (!error && order) {
        await supabase.from("order_items").insert(
          summary.lines.map((line) => ({
            order_id: order.id,
            product_id: line.product.id,
            quantity: line.quantity,
            price_at_purchase: line.product.price,
          })),
        );

        await supabase.from("cart_items").delete().eq("user_id", user.id);
        await clearCookieCart();
        revalidatePath("/cart");
        redirect(`/checkout?success=1&order=${order.id}`);
      }
    }
  }

  await clearCookieCart();
  revalidatePath("/cart");
  redirect(`/checkout?success=1&order=demo-${Date.now()}`);
}

export async function createProductAction(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/admin");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = getString(formData, "name");
  const description = getString(formData, "description");
  const category = getString(formData, "category");
  const imageUrl = getString(formData, "imageUrl");
  const price = Number(formData.get("price") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);

  await supabase.from("products").insert({
    owner_id: user.id,
    name,
    description: description || null,
    category: category || null,
    image_url: imageUrl || null,
    price: Math.max(0, Math.round(price)),
    stock: Math.max(0, Math.round(stock)),
    is_active: true,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProductAction(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/admin");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const productId = getString(formData, "productId");
  const name = getString(formData, "name");
  const description = getString(formData, "description");
  const category = getString(formData, "category");
  const imageUrl = getString(formData, "imageUrl");
  const price = Number(formData.get("price") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);
  const isActive = getString(formData, "isActive") === "on";

  await supabase
    .from("products")
    .update({
      name,
      description: description || null,
      category: category || null,
      image_url: imageUrl || null,
      price: Math.max(0, Math.round(price)),
      stock: Math.max(0, Math.round(stock)),
      is_active: isActive,
    })
    .eq("id", productId)
    .eq("owner_id", user.id);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/products/${productId}`);
  revalidatePath(`/admin/products/${productId}/edit`);
  redirect("/admin");
}

export async function deleteProductAction(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/admin");
  }

  const productId = getString(formData, "productId");

  await supabase.from("products").delete().eq("id", productId);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
