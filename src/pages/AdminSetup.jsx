"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import "./AdminSetup.css"

const AdminSetup = () => {
  const { user, isLoggedIn, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  if (!isLoggedIn || !user) {
    return (
      <div className="admin-setup-page">
        <div className="admin-setup-container">
          <h1>Admin Setup</h1>
          <p>You need to be logged in to use this page.</p>
          <button onClick={() => navigate("/login")} className="login-button">
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const setUserAsAdmin = async () => {
    try {
      setIsLoading(true)
      setMessage("")

      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        role: "admin",
        updatedAt: new Date().toISOString(),
      })

      setMessage("Admin role set! Please log out and log back in.")
    } catch (error) {
      console.error("Error setting user as admin:", error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="admin-setup-page">
      <div className="admin-setup-container">
        <h1>Admin Setup</h1>

        <div className="user-info-section">
          <h2>User Information</h2>
          <p>
            <strong>User ID:</strong> {user.uid}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Current Role:</strong> {user.role || "customer"}
          </p>
        </div>

        {message && <div className="message">{message}</div>}

        <div className="action-buttons">
          <button onClick={setUserAsAdmin} disabled={isLoading || user.role === "admin"} className="set-admin-button">
            {isLoading ? "Setting..." : user.role === "admin" ? "Already Admin" : "Set as Admin"}
          </button>

          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>

          {user.role === "admin" && (
            <button onClick={() => navigate("/admin")} className="go-admin-button">
              Go to Admin Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminSetup

// Compare this snippet from src/App.jsx: