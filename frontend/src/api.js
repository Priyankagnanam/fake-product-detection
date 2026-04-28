const API_BASE = "https://fake-product-detection-2-bbe7.onrender.com";

export const getProducts = async () => {
  const res = await fetch(`${API_BASE}/api/products`);
  return res.json();
};