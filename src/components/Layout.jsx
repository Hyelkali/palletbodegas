"use client"

import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import { initVisitorTracking } from "../services/visitorService"

const Layout = () => {
  // Initialize visitor tracking
  useEffect(() => {
    const cleanup = initVisitorTracking()
    return cleanup
  }, [])

  return (
    <div className="app">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout


// import { Outlet } from "react-router-dom"
// import Header from "./Header"
// import Footer from "./Footer"
// import Announcement from "./Announcement"
// import { useLocation } from "react-router-dom"
// import SearchOverlay from "./SearchOverlay"
// import { useSearch } from "../hooks/useSearch"

// const Layout = () => {
//   const location = useLocation()
//   const { isSearchOpen } = useSearch()

//   return (
//     <div className="site-wrapper">
//       <Announcement />
//       <Header />
//       {isSearchOpen && <SearchOverlay />}
//       <main className="main-content">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   )
// }

// export default Layout

// // Compare this snippet from src/components/admin/AdminLayout.jsx: