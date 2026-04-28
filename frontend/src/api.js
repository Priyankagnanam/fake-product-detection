const API_URL = "https://fake-product-detection-2-bbe7.onrender.com";

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/api/products`);
  return response.json();
};