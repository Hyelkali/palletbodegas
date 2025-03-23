"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase/config"
import "./Orders.css"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"))

      const querySnapshot = await getDocs(ordersQuery)
      const ordersData = []

      querySnapshot.forEach((doc) => {
        ordersData.push({
          id: doc.id,
          ...doc.data(),
        })
      })

      setOrders(ordersData)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      })

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order,
        ),
      )

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: newStatus,
          updatedAt: new Date(),
        }))
      }
    } catch (err) {
      console.error("Error updating order status:", err)
      setError("Failed to update order status")
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending"
      case "approved":
        return "status-approved"
      case "rejected":
        return "status-rejected"
      case "shipped":
        return "status-shipped"
      case "delivered":
        return "status-delivered"
      default:
        return ""
    }
  }

  return (
    <div className="admin-orders">
      <div className="container">
        <h1 className="page-title">Manage Orders</h1>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-indicator">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">No orders found</div>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id.substring(0, 8)}...</td>
                    <td>{order.customerEmail}</td>
                    <td>{new Date(order.createdAt?.toDate()).toLocaleDateString()}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
                    </td>
                    <td>
                      <button className="view-button" onClick={() => handleViewOrder(order)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal-content order-modal">
              <div className="modal-header">
                <h2>Order Details</h2>
                <button className="close-modal" onClick={closeModal}>
                  ×
                </button>
              </div>

              <div className="order-details">
                <div className="order-info">
                  <div className="info-group">
                    <h3>Order Information</h3>
                    <p>
                      <strong>Order ID:</strong> {selectedOrder.id}
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date(selectedOrder.createdAt?.toDate()).toLocaleString()}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                    <p>
                      <strong>Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}
                    </p>
                  </div>

                  <div className="info-group">
                    <h3>Customer Information</h3>
                    <p>
                      <strong>Email:</strong> {selectedOrder.customerEmail}
                    </p>
                    <p>
                      <strong>Name:</strong> {selectedOrder.shippingAddress?.firstName}{" "}
                      {selectedOrder.shippingAddress?.lastName}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}
                    </p>
                  </div>

                  <div className="info-group">
                    <h3>Shipping Address</h3>
                    <p>{selectedOrder.shippingAddress?.address}</p>
                    <p>
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
                    </p>
                    <p>{selectedOrder.shippingAddress?.country}</p>
                  </div>
                </div>

                <div className="order-items">
                  <h3>Order Items</h3>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>{item.quantity}</td>
                          <td>${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="order-actions">
                  <h3>Update Order Status</h3>
                  <div className="status-buttons">
                    <button
                      className={`status-button ${selectedOrder.status === "pending" ? "active" : ""}`}
                      onClick={() => handleUpdateStatus(selectedOrder.id, "pending")}
                      disabled={selectedOrder.status === "pending"}
                    >
                      Pending
                    </button>
                    <button
                      className={`status-button ${selectedOrder.status === "approved" ? "active" : ""}`}
                      onClick={() => handleUpdateStatus(selectedOrder.id, "approved")}
                      disabled={selectedOrder.status === "approved"}
                    >
                      Approved
                    </button>
                    <button
                      className={`status-button ${selectedOrder.status === "rejected" ? "active" : ""}`}
                      onClick={() => handleUpdateStatus(selectedOrder.id, "rejected")}
                      disabled={selectedOrder.status === "rejected"}
                    >
                      Rejected
                    </button>
                    <button
                      className={`status-button ${selectedOrder.status === "shipped" ? "active" : ""}`}
                      onClick={() => handleUpdateStatus(selectedOrder.id, "shipped")}
                      disabled={selectedOrder.status === "shipped"}
                    >
                      Shipped
                    </button>
                    <button
                      className={`status-button ${selectedOrder.status === "delivered" ? "active" : ""}`}
                      onClick={() => handleUpdateStatus(selectedOrder.id, "delivered")}
                      disabled={selectedOrder.status === "delivered"}
                    >
                      Delivered
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders

