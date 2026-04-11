// src/api/marketplaceApi.js

const API_BASE_URL = "http://127.0.0.1:5000/api";

export async function addProduct(productData) {
  const token = localStorage.getItem("token");
  const headers = {
    "Authorization": `Bearer ${token}`
  };

  let body;
  if (productData instanceof FormData) {
    // browser sets multipart/form-data boundary automatically
    body = productData;
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(productData);
  }

  const res = await fetch(`${API_BASE_URL}/products/add`, {
    method: "POST",
    headers: headers,
    body: body,
  });

  const data = await res.json();
  
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login?expired=true";
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error(data.msg || "Failed to add product");
  }
  return data;
}

export async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || "Failed to fetch products");
  }
  return data;
}

// 🛒 Get Products of current farmer
export async function getMyProducts() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/products/my`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });

  const data = await res.json();

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login?expired=true";
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error(data.msg || "Failed to fetch your products");
  }
  return data;
}

// 🛒 Simulate Order
export async function orderProduct(productId) {
  const res = await fetch(`${API_BASE_URL}/products/order/${productId}`, {
    method: "POST",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || "Order failed");
  }
  return data;
}

// 🛒 Delete Product
export async function deleteProduct(productId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });

  const data = await res.json();

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login?expired=true";
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error(data.msg || "Failed to remove product");
  }
  return data;
}

// 🛒 Get Incoming Orders (for farmer)
export async function getMyIncomingOrders() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/products/orders/my`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });

  const data = await res.json();

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login?expired=true";
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error(data.msg || "Failed to fetch orders");
  }
  return data;
}
