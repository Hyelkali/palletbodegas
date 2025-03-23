"use client"

import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoadingScreen from "./LoadingScreen"

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isLoggedIn, isAdmin, loading, user } = useAuth()
  const location = useLocation()

  console.log("Protected Route Check at path:", location.pathname)
  console.log("Auth state:", {
    isLoggedIn,
    isAdmin,
    requireAdmin,
    userEmail: user?.email,
    userRole: user?.role,
    loading,
  })

  if (loading) {
    console.log("Still loading auth state...")
    return <LoadingScreen message="Verifying authentication..." />
  }

  if (!isLoggedIn) {
    console.log("Not logged in, redirecting to login")
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    console.log("Not admin, redirecting to home")
    return <Navigate to="/" replace />
  }

  console.log("Access granted to protected route")
  return <Outlet />
}

export default ProtectedRoute

