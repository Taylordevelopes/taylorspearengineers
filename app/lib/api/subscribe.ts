// lib/api/auth.ts

export async function subscribe(email: string) {
  const res = await fetch("https://api.spearitual.xyz/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}
