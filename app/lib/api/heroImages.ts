export async function getHeroImages() {
  const res = await fetch("https://api.spearitual.xyz/heroimages", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch hero images");
  }
  return res.json();
}
