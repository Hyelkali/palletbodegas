"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import AdminLayout from "./components/admin/AdminLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home.jsx"
import Catalog from "./pages/Catalog.jsx"
import Contact from "./pages/Contact.jsx"
import TodaysDeals from "./pages/TodaysDeals.jsx"
import ProductDetail from "./pages/ProductDetail.jsx"
import Cart from "./pages/Cart.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import ForgotPassword from "./pages/ForgotPassword.jsx"
import NotFound from "./pages/NotFound.jsx"
import Support from "./pages/Support.jsx"
import Checkout from "./pages/Checkout.jsx"
import ThankYou from "./pages/ThankYou.jsx"
import AdminOrders from "./pages/admin/Orders.jsx"
import Viewers from "./components/admin/Viewers.jsx"
import AdminSetup from "./pages/AdminSetup.jsx"
import { useAuth } from "./context/AuthContext"
import { useEffect } from "react"
import { initVisitorTracking } from "./services/visitorService"

function App() {
  const { isAdmin } = useAuth()

  // Initialize visitor tracking
  useEffect(() => {
    initVisitorTracking()
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
          <Route index element={<Navigate to="/admin/orders" replace />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="viewers" element={<Viewers />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App

