"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useSearch } from "../hooks/useSearch"
import UserAvatar from "./UserAvatar"
import "./Header.css"

const Header = () => {
  const { cartItems } = useCart()
  const { isLoggedIn, isAdmin, user } = useAuth()
  const { openSearch } = useSearch()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    // Add close functionality for mobile menu
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }

  const handleCartClick = () => {
    navigate("/cart")
  }

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate("/account")
    } else {
      navigate("/login")
    }
  }

  console.log("Header rendering, isAdmin:", isAdmin, "user email:", user?.email)

  return (
    <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container header-container">
        <div className="logo-container">
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="Pallet Bodega" className="logo-image" />
          </Link>
        </div>

        <nav className={`main-nav ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/catalog" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Catalog
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/todays-deals" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Today's Deals
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item admin-nav-item">
                <Link to="/admin" className="nav-link admin-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="header-actions">
          <button className="icon-button search-button" onClick={openSearch} aria-label="Search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {isLoggedIn ? (
            <UserAvatar />
          ) : (
            <button className="icon-button account-button" onClick={handleAccountClick} aria-label="Account">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          )}

          {isLoggedIn && isAdmin && (
            <Link to="/admin" className="admin-link">
              <button className="icon-button admin-button" aria-label="Admin Dashboard">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </button>
            </Link>
          )}

          <button className="icon-button cart-button" onClick={handleCartClick} aria-label="Cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
          </button>

          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="close-icon"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <span className="hamburger"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

