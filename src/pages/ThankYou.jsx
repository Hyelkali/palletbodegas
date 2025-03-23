"use client"

import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { getOrderById } from "../services/firebaseServices"
import { useAuth } from "../context/AuthContext"
import "./ThankYou.css"

const ThankYou = () => {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login")
      return
    }

    const queryParams = new URLSearchParams(location.search)
    const orderId = queryParams.get("orderId")

    if (!orderId) {
      navigate("/")
      return
    }

    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(orderId)
        setOrder(orderData)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Could not find your order. Please contact customer support.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [isLoggedIn, location.search, navigate])

  if (loading) {
    return (
      <div className="thank-you-page">
        <div className="container">
          <div className="loading-indicator">Loading order details...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="thank-you-page">
        <div className="container">
          <div className="error-message">{error}</div>
          <div className="thank-you-actions">
            <Link to="/" className="back-to-home">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="thank-you-page">
      <div className="container">
        <div className="thank-you-content">
          <div className="thank-you-header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="success-icon"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h1 className="thank-you-title">Thank You for Your Order!</h1>
            <p className="thank-you-message">Your order has been received and is now being processed.</p>
          </div>

          <div className="order-details">
            <h2 className="section-title">Order Details</h2>
            <div className="order-info">
              <p>
                <strong>Order Number:</strong> {order.id}
              </p>
              <p>
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total:</strong> ${order.totalAmount.toFixed(2)} USD
              </p>
            </div>

            <h3 className="subsection-title">Items Ordered</h3>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <h3 className="subsection-title">Shipping Address</h3>
            <div className="shipping-address">
              <p>
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="thank-you-actions">
            <Link to="/" className="back-to-home">
              Continue Shopping
            </Link>
            <Link to="/support" className="contact-support">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThankYou

