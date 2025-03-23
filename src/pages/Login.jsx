"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get redirect path from URL query params
  const queryParams = new URLSearchParams(location.search)
  const redirectPath = queryParams.get("redirect") || "/"

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectPath === "checkout" ? "/checkout" : "/")
    }
  }, [isLoggedIn, navigate, redirectPath])

  // Load checkout data if coming from checkout
  useEffect(() => {
    if (redirectPath === "checkout") {
      const savedCheckoutData = sessionStorage.getItem("checkoutData")
      if (savedCheckoutData) {
        try {
          const checkoutData = JSON.parse(savedCheckoutData)
          if (checkoutData.email) {
            setEmail(checkoutData.email)
          }
        } catch (error) {
          console.error("Error parsing checkout data:", error)
        }
      }
    }
  }, [redirectPath])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await login(email, password)
      // Navigate to the redirect path (handled by useEffect)
    } catch (error) {
      console.error("Login error:", error)
      setError(error.message || "Failed to login. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Pallet Bodega</h1>

        <div className="login-form-container">
          <h2 className="login-heading">Log in</h2>
          <p className="login-description">Enter your email and password to log in</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="login-input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="login-input"
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <div className="button-loader">
                  <div className="loader-spinner"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="register-prompt">
              Don't have an account?{" "}
              <Link to="/register" className="register-link">
                Register
              </Link>
            </p>
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

