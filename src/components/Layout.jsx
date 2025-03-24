"use client"

import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import Announcement from "./Announcement"
import SearchOverlay from "./SearchOverlay"
import { useSearch } from "../hooks/useSearch"
import { initVisitorTracking } from "../services/visitorService"

const Layout = () => {
  const { isSearchOpen } = useSearch()

  // Initialize visitor tracking
  useEffect(() => {
    const cleanup = initVisitorTracking()
    return cleanup
  }, [])

  return (
    <div className="site-wrapper">
      <Header />
      {isSearchOpen && <SearchOverlay />}
      <Announcement />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout

