"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./Footer.css"

// Initialize SendGrid API Key

const Footer = () => {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false); // Corrected variable name

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault()

    if (!email) return

    try {
      // Send welcome email
      const msg = {
        to: email,
        from: 'your-email@example.com', // Change this to your verified sender email
        subject: 'Welcome to Our Newsletter!',
        text: 'Thank you for subscribing! We will keep you updated with our latest news.',
        html: '<strong>Thank you for subscribing!</strong> We will keep you updated with our latest news.',
      };

      await sgMail.send(msg);

      // Update local state
      setIsSubscribed(true)
      setEmail("")

      // Reset subscription message after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false)
      }, 5000)
    } catch (error) {
      console.error("Subscription error:", error)
    }
  }

  return (
    <footer className="site-footer">
      <div className="subscribe-section">
        <div className="container">
          <h2 className="subscribe-title">SUBSCRIBE TO OUR EMAILS</h2>
          <p className="subscribe-text">Be the first to know about new collections and exclusive offers.</p>

          <form className="subscribe-form" onSubmit={handleSubscribe}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="subscribe-input"
              />
              <button type="submit" className="subscribe-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
            {isSubscribed && <p className="subscribe-success">Thanks for subscribing!</p>}
          </form>
        </div>
      </div>

      <div className="footer-main">
        <div className="container">
          <div className="footer-shop">
            <button className="follow-button" onClick={handleFollowClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isFollowing ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {isFollowing ? "Following" : "Follow on shop"}
            </button>
          </div>

          <div className="payment-methods">
            <img src="/images/payment/american-express.svg" alt="American Express" className="payment-icon" />
            <img src="/images/payment/apple-pay.svg" alt="Apple Pay" className="payment-icon" />
            <img src="/images/payment/diners-club.svg" alt="Diners Club" className="payment-icon" />
            <img src="/images/payment/discover.svg" alt="Discover" className="payment-icon" />
            <img src="/images/payment/google-pay.svg" alt="Google Pay" className="payment-icon" />
            <img src="/images/payment/mastercard.svg" alt="Mastercard" className="payment-icon" />
            <img src="/images/payment/shop-pay.svg" alt="Shop Pay" className="payment-icon" />
            <img src="/images/payment/visa-pay.svg" alt="Visa" className="payment-icon" />
          </div>

          <div className="footer-info">
            <p className="copyright">
              &copy; {new Date().getFullYear()}, Pallet Bodega
              <span className="powered-by">Powered by Shopify</span>
            </p>
            <Link to="/privacy-policy" className="footer-link">
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
