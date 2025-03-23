"use client"

import { Link, useLocation, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./AdminLayout.css"

const AdminLayout = () => {
  const { logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>

        <nav className="admin-nav">
          <ul className="admin-nav-list">
            <li className="admin-nav-item">
              <Link to="/admin/orders" className={`admin-nav-link ${isActive("/admin/orders") ? "active" : ""}`}>
                Orders
              </Link>
            </li>
            <li className="admin-nav-item">
              <Link to="/admin/viewers" className={`admin-nav-link ${isActive("/admin/viewers") ? "active" : ""}`}>
                Viewers
              </Link>
            </li>
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="view-store-link">
            View Store
          </Link>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout

