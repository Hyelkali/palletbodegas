"use client"

import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import AdminLayout from "./components/admin/AdminLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Catalog from "./pages/Catalog"
import Contact from "./pages/Contact"
import TodaysDeals from "./pages/TodaysDeals"
import ProductDetail from "./pages/ProductDetail.jsx"
import Cart from "./pages/Cart"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import NotFound from "./pages/NotFound"
import Support from "./pages/Support"
import Checkout from "./pages/Checkout"
import ThankYou from "./pages/ThankYou"
import AdminOrders from "./pages/admin/Orders"
import Viewers from "./pages/admin/Viewers"
import AdminSetup from "./pages/AdminSetup"
import { useAuth } from "./context/AuthContext"
import { useEffect } from "react"
import { initVisitorTracking } from "./services/visitorService"

function App() {
  const { isAdmin } = useAuth()

  // Initialize visitor tracking
  useEffect(() => {
    try {
      initVisitorTracking()
    } catch (error) {
      console.error("Error initializing visitor tracking:", error)
    }
  }, [])

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="contact" element={<Contact />} />
        <Route path="todays-deals" element={<TodaysDeals />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="support" element={<Support />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="thank-you" element={<ThankYou />} />
        <Route path="admin-setup" element={<AdminSetup />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute requireAdmin={true} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOrders />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="viewers" element={<Viewers />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App

