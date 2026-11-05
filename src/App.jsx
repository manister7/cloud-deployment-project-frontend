import { useEffect, useState } from "react";

import {
  getCatalogHealth,
  getOrderHealth,
  getProducts,
  getOrders,
  createOrder,
  deleteOrder
} from "./api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [catalogStatus, setCatalogStatus] = useState("checking...");
  const [orderStatus, setOrderStatus] = useState("checking...");
  const [customerName, setCustomerName] = useState("");
  const [productId, setProductId] = useState("");

  const loadProducts = () =>
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));

  const loadOrders = () =>
    getOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]));

  useEffect(() => {
    getCatalogHealth()
      .then(() => setCatalogStatus("up"))
      .catch(() => setCatalogStatus("down"));

    getOrderHealth()
      .then(() => setOrderStatus("up"))
      .catch(() => setOrderStatus("down"));

    loadProducts();
    loadOrders();
  }, []);

  const handleCreateOrder = (e) => {
    e.preventDefault();

    if (!customerName || !productId) return;

    createOrder({
      customer_name: customerName,
      product_id: Number(productId)
    }).then(() => {
      setCustomerName("");
      setProductId("");
      loadOrders();
    });
  };

  const handleDeleteOrder = (id) => {
    deleteOrder(id).then(loadOrders);
  };

  return (
    <div className="container">
      <header>
        <h1>Three-Tier Demo</h1>
        <p>React frontend &rarr; FastAPI services &rarr; database</p>
      </header>

      <div className="status-grid">
        <div className="status-card">
          <strong>Catalog Service:</strong> {catalogStatus}
        </div>
        <div className="status-card">
          <strong>Order Service:</strong> {orderStatus}
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Products</h2>

          {products.map((p) => (
            <div
              className="product-row"
              key={p.id}
            >
              <span>{p.name}</span>
              <span className="price">${p.price.toFixed(2)}</span>
            </div>
          ))}

          {products.length === 0 && <p>No products found.</p>}
        </div>

        <div>
          <div className="card">
            <h2>Create Order</h2>

            <form onSubmit={handleCreateOrder}>
              <input
                placeholder="Customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value="">Select product</option>

                {products.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                  >
                    {p.name} — ${p.price.toFixed(2)}
                  </option>
                ))}
              </select>

              <button type="submit">Place Order</button>
            </form>
          </div>

          <div className="card">
            <h2>Orders</h2>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customer_name}</td>
                    <td>{o.product_name}</td>
                    <td>{String(o.created_at).slice(0, 19).replace("T", " ")}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteOrder(o.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && <p>No orders yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}