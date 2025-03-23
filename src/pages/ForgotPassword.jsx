"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./ForgotPassword.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      await resetPassword(email)
      setSuccessMessage("Password reset email sent. Check your inbox.")
      setEmail("")
    } catch (error) {
      console.error("Password reset error:", error)
      setError(error.message || "Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h1 className="forgot-password-title">Pallet Bodega</h1>

        <div className="forgot-password-form-container">
          <h2 className="forgot-password-heading">Reset Password</h2>
          <p className="forgot-password-description">
            Enter your email address and we'll send you a link to reset your password
          </p>

          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="forgot-password-input"
              />
            </div>

            {error && <p className="forgot-password-error">{error}</p>}
            {successMessage && <p className="forgot-password-success">{successMessage}</p>}

            <button type="submit" className="forgot-password-button" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="forgot-password-footer">
            <Link to="/login" className="back-to-login-link">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

