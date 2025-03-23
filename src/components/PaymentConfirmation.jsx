"use client"

import { useState } from "react"
import { createOrder, getOrderById } from "../services/firebaseServices"
import { useAuth } from "../context/AuthContext"
import "./PaymentConfirmation.css"

const PaymentConfirmation = ({ amount, items, shippingAddress, onConfirm, onCancel }) => {
  const [isPaid, setIsPaid] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [error, setError] = useState("")
  const { user } = useAuth()

  const handlePaidClick = async () => {
    try {
      setIsPaid(true)
      setIsWaiting(true)

      // Create order in Firebase
      const orderData = {
        customerEmail: user.email,
        customerId: user.uid,
        items,
        totalAmount: amount,
        shippingAddress,
        status: "pending",
      }

      const order = await createOrder(orderData)
      setOrderId(order.id)

      // Start polling for order status
      const intervalId = setInterval(async () => {
        try {
          const updatedOrder = await getOrderById(order.id)

          if (updatedOrder.status === "approved") {
            clearInterval(intervalId)
            setIsConfirmed(true)
            setIsWaiting(false)

            // Call the onConfirm callback after a short delay
            setTimeout(() => {
              onConfirm(order.id)
            }, 2000)
          } else if (updatedOrder.status === "rejected") {
            clearInterval(intervalId)
            setIsWaiting(false)
            setError("Your payment was rejected. Please try again or contact support.")
          }
        } catch (err) {
          console.error("Error checking order status:", err)
        }
      }, 5000) // Check every 5 seconds

      // Clean up interval on component unmount
      return () => clearInterval(intervalId)
    } catch (err) {
      console.error("Error creating order:", err)
      setIsWaiting(false)
      setError("There was an error processing your payment. Please try again.")
    }
  }

  return (
    <div className="payment-confirmation">
      <div className="payment-modal">
        <div className="payment-header">
          <h2 className="payment-title">Payment Confirmation</h2>
        </div>

        <div className="payment-content">
          <p className="payment-amount">Amount: ${amount.toFixed(2)} USD</p>

          {!isPaid ? (
            <div className="payment-actions">
              <p className="payment-instructions">
                Please complete your payment using your preferred method, then click the button below to confirm.
              </p>
              <button className="paid-button" onClick={handlePaidClick}>
                I Have Paid
              </button>
              <button className="cancel-button" onClick={onCancel}>
                Cancel
              </button>
            </div>
          ) : isWaiting ? (
            <div className="payment-waiting">
              <div className="spinner"></div>
              <p>Waiting for payment confirmation from our team...</p>
              <p className="order-id">Order ID: {orderId}</p>
            </div>
          ) : isConfirmed ? (
            <div className="payment-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <p>Payment confirmed! Thank you for your purchase.</p>
              <p className="order-id">Order ID: {orderId}</p>
            </div>
          ) : error ? (
            <div className="payment-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>{error}</p>
              <button className="try-again-button" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default PaymentConfirmation

