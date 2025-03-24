"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import PaymentConfirmation from "../components/PaymentConfirmation"
import "./Checkout.css"
import { sendOrderNotification } from "../services/emailServices"

const Checkout = () => {
  const { cartItems, clearCart } = useCart()
  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
  })

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  // Check if cart is empty and set redirect flag
  useEffect(() => {
    if (cartItems.length === 0) {
      setShouldRedirect(true)
    }
  }, [cartItems])

  // Handle redirect if cart is empty
  useEffect(() => {
    if (shouldRedirect) {
      navigate("/cart")
    }
  }, [shouldRedirect, navigate])

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
      }))
    }
  }, [isLoggedIn, user])

  // Load saved checkout data from session storage
  useEffect(() => {
    const savedCheckoutData = sessionStorage.getItem("checkoutData")
    if (savedCheckoutData) {
      try {
        const checkoutData = JSON.parse(savedCheckoutData)
        setFormData((prev) => ({
          ...prev,
          ...checkoutData,
        }))
      } catch (error) {
        console.error("Error parsing checkout data:", error)
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Save to session storage as user types
    const updatedData = { ...formData, [name]: value }
    sessionStorage.setItem("checkoutData", JSON.stringify(updatedData))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isLoggedIn) {
      setShowLoginPrompt(true)
      return
    }

    setShowPaymentModal(true)
  }

  const handlePaymentConfirm = async (orderId) => {
    // Process the order
    clearCart()

    // Clear checkout data from session storage
    sessionStorage.removeItem("checkoutData")

    // Mock order data for the email notification
    const orderData = {
      orderId: orderId,
      items: cartItems,
      shippingAddress: formData,
      totalAmount: calculateTotal(),
      userEmail: formData.email,
    }

    // After successful order creation, send notification
    await sendOrderNotification(orderData)

    // Navigate to thank you page with order ID
    navigate(`/thank-you?orderId=${orderId}`)
  }

  const handlePaymentCancel = () => {
    setShowPaymentModal(false)
  }

  const handleLoginRedirect = () => {
    // Store checkout data in session storage
    sessionStorage.setItem("checkoutData", JSON.stringify(formData))
    navigate("/login?redirect=checkout")
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    // Add shipping, tax, etc. if needed
    return subtotal
  }

  // If cart is empty, don't render anything while the redirect happens
  if (shouldRedirect) {
    return null
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-container">
          <div className="checkout-form-container">
            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h2 className="section-title">Contact information</h2>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    disabled={isLoggedIn}
                  />
                </div>

                {!isLoggedIn && (
                  <div className="login-prompt">
                    <p>
                      Already have an account?{" "}
                      <button type="button" onClick={handleLoginRedirect} className="login-link">
                        Log in
                      </button>
                    </p>
                  </div>
                )}
              </div>

              <div className="form-section">
                <h2 className="section-title">Shipping information</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="form-select"
                    >
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="NG">Nigeria</option>
                      <option value="GH">Ghana</option>
                      <option value="KE">Kenya</option>
                      <option value="ZA">South Africa</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="postalCode" className="form-label">
                      Postal code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="checkout-button">
                  {isLoggedIn ? "Proceed to Payment" : "Log in to Complete Order"}
                </button>
              </div>
            </form>
          </div>

          <div className="order-summary">
            <h2 className="summary-title">Order summary</h2>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="item-info">
                    <span className="item-quantity">{item.quantity} ×</span>
                    <span className="item-name">{item.name}</span>
                  </div>
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentConfirmation
          amount={calculateTotal()}
          items={cartItems}
          shippingAddress={formData}
          onConfirm={handlePaymentConfirm}
          onCancel={handlePaymentCancel}
        />
      )}

      {showLoginPrompt && (
        <div className="login-modal">
          <div className="login-modal-content">
            <h2>Login Required</h2>
            <p>You need to be logged in to complete your purchase.</p>
            <div className="login-modal-actions">
              <button onClick={handleLoginRedirect} className="login-button">
                Go to Login
              </button>
              <button onClick={() => setShowLoginPrompt(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout

