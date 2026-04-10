// src/api/authApi.js

const API_BASE_URL = "http://127.0.0.1:5000/api/auth";

export async function login(credentials) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Login failed");
  return data;
}

export async function register(userData) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Registration failed");
  return data;
}

export async function getProfile() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/profile`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Failed to fetch profile");
  return data;
}

export async function updateProfile(formData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/profile/update`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error || "Failed to update profile");
  return data;
}

export async function verifyFarmer() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/profile/verify`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error || "Verification failed");
  return data;
}
