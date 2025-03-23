"use client"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./Cart.css"

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart()

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="container">
          <h1 className="page-title">Your cart is empty</h1>
          <div className="empty-cart-actions">
            <Link to="/catalog" className="continue-shopping">
              Continue shopping
            </Link>
          </div>

          <div className="account-prompt">
            <h2 className="account-prompt-title">Have an account?</h2>
            <Link to="/login" className="login-link">
              Log in
            </Link>{" "}
            to check out faster.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Your cart</h1>

        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} />
                </div>

                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">${item.price.toFixed(2)} USD</p>

                  <div className="item-actions">
                    <div className="quantity-selector">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        aria-label="Decrease quantity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>

                      <span className="quantity-value">{item.quantity}</span>

                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>

                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)} USD</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>${calculateSubtotal().toFixed(2)} USD</span>
            </div>

            <div className="checkout-actions">
              <Link to="/checkout" className="checkout-btn">
                Checkout
              </Link>

              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

