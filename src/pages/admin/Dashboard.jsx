"use client"

import { useState, useEffect } from "react"
import { getPendingOrders, updateOrderStatus } from "../../services/firebaseServices"
import { useAuth } from "../../context/AuthContext"
import "./Dashboard.css"

const Dashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        setLoading(true)
        const orders = await getPendingOrders()
        setPendingOrders(orders)
      } catch (err) {
        console.error("Error fetching pending orders:", err)
        setError("Failed to load pending orders")
      } finally {
        setLoading(false)
      }
    }

    fetchPendingOrders()
  }, [])

  const handleApprovePayment = async (orderId) => {
    try {
      await updateOrderStatus(orderId, "approved", user.uid)

      // Update local state
      setPendingOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId))
    } catch (err) {
      console.error("Error approving payment:", err)
      setError("Failed to approve payment")
    }
  }

  const handleRejectPayment = async (orderId) => {
    try {
      await updateOrderStatus(orderId, "rejected", user.uid)

      // Update local state
      setPendingOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId))
    } catch (err) {
      console.error("Error rejecting payment:", err)
      setError("Failed to reject payment")
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        <div className="dashboard-section">
          <h2 className="section-title">Pending Payment Approvals</h2>

          {loading ? (
            <div className="loading-indicator">Loading pending orders...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : pendingOrders.length === 0 ? (
            <div className="empty-state">No pending orders to approve</div>
          ) : (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id.substring(0, 8)}...</td>
                      <td>{order.customerEmail}</td>
                      <td>{new Date(order.createdAt?.toDate()).toLocaleDateString()}</td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                      <td className="action-buttons">
                        <button className="approve-button" onClick={() => handleApprovePayment(order.id)}>
                          Approve
                        </button>
                        <button className="reject-button" onClick={() => handleRejectPayment(order.id)}>
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

