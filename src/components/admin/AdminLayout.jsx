"use client"

import { Outlet, NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./AdminLayout.css"

const AdminLayout = () => {
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? "active" : "")}>
            Orders
          </NavLink>
          <NavLink to="/admin/viewers" className={({ isActive }) => (isActive ? "active" : "")}>
            Viewers
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" className="view-store-link" target="_blank" rel="noopener noreferrer">
            View Store
          </a>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout

