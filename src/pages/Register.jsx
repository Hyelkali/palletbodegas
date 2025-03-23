"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Register.css"

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { register, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await register(email, password)
      // Navigate to home (handled by useEffect)
    } catch (error) {
      console.error("Registration error:", error)
      setError(error.message || "Failed to register. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">Pallet Bodega</h1>

        <div className="register-form-container">
          <h2 className="register-heading">Create Account</h2>
          <p className="register-description">Enter your details to create an account</p>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="register-input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="register-input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="register-input"
              />
            </div>

            {error && <p className="register-error">{error}</p>}

            <button type="submit" className="register-button" disabled={isLoading}>
              {isLoading ? (
                <div className="button-loader">
                  <div className="loader-spinner"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

