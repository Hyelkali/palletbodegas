"use client"

import { useAuth } from "../context/AuthContext"
import "./UseAvatar.css"

const UseAvatar = () => {
  const { user, isLoggedIn, logout } = useAuth()

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
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default UseAvatar

