import { Apps } from "@/app/types/types";

// Get all apps
export async function getApps() {
  const res = await fetch("https://api.spearitual.xyz/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch products: ${res.status} ${res.statusText}`,
    );
  }

  const data = await res.json();
  // Backend might return { products: [...] } or just [...]
  return Array.isArray(data) ? data : data.products || [];
}

// Get single app by slug
export async function getAppBySlug(slug: string) {
  const res = await fetch(`https://api.spearitual.xyz/products/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch product: ${res.status} ${res.statusText}. Tried URL: https://api.spearitual.xyz/products/${slug}`,
    );
  }

  const data = await res.json();
  return data;
}

// Create a new app
export async function createApp({
  title,
  description,
  image_url,
  site_url,
  download_url,
  featured,
  is_phone_app,
}: {
  title: string;
  description: string;
  image_url: string;
  site_url?: string;
  download_url?: string;
  featured: boolean;
  is_phone_app: boolean;
}) {
  const res = await fetch(`https://api.spearitual.xyz/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      title,
      description,
      image_url,
      site_url,
      download_url,
      featured,
      is_phone_app,
    }),
  });

  if (!res.ok) {
    let errorMessage = `Failed to create product: ${res.status} ${res.statusText}`;
    try {
      const errorData = await res.json();
      errorMessage += `\nServer error: ${JSON.stringify(errorData)}`;
    } catch {
      const errorText = await res.text();
      if (errorText) {
        errorMessage += `\nServer response: ${errorText}`;
      }
    }
    throw new Error(errorMessage);
  }

  const data = await res.json();
  return data;
}

// Update a app
export async function updateApp({
  slug,
  title,
  description,
  image_url,
  site_url,
  download_url,
  featured,
  is_phone_app,
}: {
  slug: string;
  title: string;
  description: string;
  image_url: string;
  site_url?: string;
  download_url?: string;
  featured: boolean;
  is_phone_app: boolean;
}) {
  const res = await fetch(`https://api.spearitual.xyz/products/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      title,
      description,
      image_url,
      site_url,
      download_url,
      featured,
      is_phone_app,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to update product: ${res.status} ${res.statusText}`,
    );
  }

  const data = await res.json();
  // Backend returns { message: "...", product: {...} }
  return data.product || data;
}

// Delete a app
export async function deleteApp(slug: string) {
  const res = await fetch(`https://api.spearitual.xyz/products/${slug}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to delete product: ${res.status} ${res.statusText}`,
    );
  }

  const data = await res.json();
  return data;
}
