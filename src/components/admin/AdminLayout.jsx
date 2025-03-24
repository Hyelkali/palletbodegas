"use client"

import { useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Menu, X } from "lucide-react"
import "./AdminLayout.css"

const AdminLayout = () => {
  const { logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(() => {
    // Set initial active tab based on URL path
    if (location.pathname.includes("transactions")) return "transactions"
    if (location.pathname.includes("viewers")) return "viewers"
    return "orders"
  })

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className="admin-layout">
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`admin-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>

        <nav className="admin-nav">
          <ul className="admin-nav-list">
            <li className="admin-nav-item">
              <NavLink
                to="/admin/orders"
                className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setActiveTab("orders")
                }}
              >
                Orders
              </NavLink>
            </li>
            <li className="admin-nav-item">
              <NavLink
                to="/admin/viewers"
                className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setActiveTab("viewers")
                }}
              >
                Viewers
              </NavLink>
            </li>
            <li className="admin-nav-item">
              <NavLink
                to="/admin/transactions"
                className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setActiveTab("transactions")
                }}
              >
                Transactions
              </NavLink>
            </li>
          </ul>
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

