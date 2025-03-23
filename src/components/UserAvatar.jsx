"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./UserAvatar.css"

const UserAvatar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth()

  if (!isLoggedIn || !user) {
    return null
  }

  // Get the first letter of the email
  const firstLetter = user.email.charAt(0).toUpperCase()

  return (
    <div className="user-avatar-container">
      <div className="user-avatar" title={user.email}>
        {firstLetter}
      </div>
      <div className="user-dropdown">
        <div className="user-info">
          <p className="user-email">{user.email}</p>
          <p className="user-role">{user.role === "admin" ? "Administrator" : "Customer"}</p>
        </div>

        {isAdmin && (
          <Link to="/admin" className="admin-dashboard-link">
            Admin Dashboard
          </Link>
        )}

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default UserAvatar

