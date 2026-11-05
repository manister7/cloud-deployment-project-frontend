import axios from "axios";

const catalogApi = axios.create({
  baseURL: import.meta.env.VITE_CATALOG_API || "http://localhost:8001"
});

const orderApi = axios.create({
  baseURL: import.meta.env.VITE_ORDER_API || "http://localhost:8002"
});

export const getCatalogHealth = () =>
  catalogApi.get("/health");

export const getOrderHealth = () =>
  orderApi.get("/health");

export const getProducts = () =>
  catalogApi.get("/products");

export const getOrders = () =>
  orderApi.get("/orders");

export const createOrder = (data) =>
  orderApi.post("/orders", data);

export const deleteOrder = (id) =>
  orderApi.delete(`/orders/${id}`);
