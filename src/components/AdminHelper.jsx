"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { setUserAsAdmin } from "../utils/setAdminRole"
import "./AdminHelper.css"

const AdminHelper = () => {
  const { user, isAdmin, logout } = useAuth()
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  if (!isVisible || !user) return null

  const handleSetAdmin = async () => {
    try {
      setIsLoading(true)
      setMessage("")
      await setUserAsAdmin(user.uid)
      setMessage("Admin role set! Please log out and log back in.")
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const handleGoToAdmin = () => {
    navigate("/admin")
  }

  return (
    <div className="admin-helper">
      <div className="admin-helper-header">
        <h3>Account Information</h3>
        <button className="close-button" onClick={() => setIsVisible(false)}>
          ×
        </button>
      </div>
      <div className="admin-helper-content">
        <p>
          <strong>User ID:</strong> {user.uid}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role || "customer"}
        </p>
        <p>
          <strong>Admin Access:</strong> {isAdmin ? "Yes" : "No"}
        </p>

        {message && <p className="message">{message}</p>}

        <div className="admin-helper-actions">
          {!isAdmin && (
            <button className="set-admin-button" onClick={handleSetAdmin} disabled={isLoading}>
              {isLoading ? "Setting..." : "Set as Admin"}
            </button>
          )}

          {isAdmin && (
            <button className="go-admin-button" onClick={handleGoToAdmin}>
              Go to Admin Dashboard
            </button>
          )}

          <button className="logout-button" onClick={handleLogout}>
            Logout & Re-login
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminHelper

