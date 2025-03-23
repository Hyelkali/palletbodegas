"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase/config"

// Import only the visitor tracking service for now
// We'll add email notifications later
import { trackVisitor } from "../services/visitorService"

// Create the context
const AuthContext = createContext()

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)

// Define admin email constant
const ADMIN_EMAIL = "hyelnamunianthan@gmail.com"

export const AuthProvider = ({ children }) => {
  // State to track user, login status, admin status, and loading state
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        console.log("User signed in:", firebaseUser.email)

        // Check if this is the admin email
        const isAdminEmail = firebaseUser.email === ADMIN_EMAIL
        console.log("Is admin email?", isAdminEmail)

        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

          let userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: isAdminEmail ? "admin" : "customer", // Default role based on email
          }

          if (userDoc.exists()) {
            // Combine Firebase auth data with Firestore data
            const firestoreData = userDoc.data()
            console.log("User data from Firestore:", firestoreData)

            userData = {
              ...userData,
              ...firestoreData,
              // Force admin role if it's the admin email
              role: isAdminEmail ? "admin" : firestoreData.role || "customer",
            }
          } else {
            // If user document doesn't exist in Firestore, create it
            console.log("Creating new user document with role:", userData.role)
            await setDoc(doc(db, "users", firebaseUser.uid), {
              email: firebaseUser.email,
              role: userData.role,
              createdAt: new Date().toISOString(),
            })
          }

          setUser(userData)
          setIsLoggedIn(true)

          // Set admin status based on email or role
          const adminStatus = isAdminEmail || userData.role === "admin"
          setIsAdmin(adminStatus)
          console.log("Admin status set to:", adminStatus)
        } catch (error) {
          console.error("Error fetching user data:", error)
          // Basic user data if Firestore fetch fails
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: isAdminEmail ? "admin" : "customer",
          }

          setUser(userData)
          setIsLoggedIn(true)
          setIsAdmin(isAdminEmail)
          console.log("Admin status set to (after error):", isAdminEmail)
        }
      } else {
        // User is signed out
        console.log("User is signed out")
        setUser(null)
        setIsLoggedIn(false)
        setIsAdmin(false)
      }

      setLoading(false)
    })

    // Cleanup subscription
    return () => unsubscribe()
  }, [])

  // Function to log in a user
  const login = async (email, password) => {
    try {
      console.log("Attempting login with email:", email)

      // Check if this is the admin email
      const isAdminEmail = email === ADMIN_EMAIL
      console.log("Is admin email?", isAdminEmail)

      // Add timeout handling
      const loginPromise = signInWithEmailAndPassword(auth, email, password)

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Login timed out. Please check your internet connection.")), 15000),
      )

      // Race the promises
      const userCredential = await Promise.race([loginPromise, timeoutPromise])
      console.log("Login successful for:", userCredential.user.email)

      // After successful login, track the login
      // We'll add email notifications later
      try {
        await trackVisitor("/login")
      } catch (error) {
        console.error("Error tracking login:", error)
        // Don't fail the login if tracking fails
      }

      return userCredential.user
    } catch (error) {
      console.error("Login error:", error)

      // Provide more specific error messages
      if (error.code === "auth/network-request-failed") {
        throw new Error("Network connection error. Please check your internet connection and try again.")
      } else if (error.message && error.message.includes("timed out")) {
        throw new Error(error.message)
      } else {
        throw new Error(getAuthErrorMessage(error.code))
      }
    }
  }

  // Function to register a new user
  const register = async (email, password) => {
    try {
      console.log("Attempting registration with email:", email)

      // Check if this is the admin email
      const isAdminEmail = email === ADMIN_EMAIL
      console.log("Is admin email?", isAdminEmail)

      // Add timeout handling
      const registerPromise = createUserWithEmailAndPassword(auth, email, password)

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Registration timed out. Please check your internet connection.")), 15000),
      )

      // Race the promises
      const userCredential = await Promise.race([registerPromise, timeoutPromise])
      console.log("Registration successful for:", userCredential.user.email)

      // Create user document in Firestore with appropriate role
      const role = isAdminEmail ? "admin" : "customer"
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        role,
        createdAt: new Date().toISOString(),
      })

      return userCredential.user
    } catch (error) {
      console.error("Registration error:", error)

      // Provide more specific error messages
      if (error.code === "auth/network-request-failed") {
        throw new Error("Network connection error. Please check your internet connection and try again.")
      } else if (error.message && error.message.includes("timed out")) {
        throw new Error(error.message)
      } else {
        throw new Error(getAuthErrorMessage(error.code))
      }
    }
  }

  // Function to log out a user
  const logout = async () => {
    try {
      console.log("Logging out user")
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  // Function to send password reset email
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return true
    } catch (error) {
      console.error("Password reset error:", error)
      throw new Error(getAuthErrorMessage(error.code))
    }
  }

  // Helper function to get user-friendly error messages
  const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No user found with this email address"
      case "auth/wrong-password":
        return "Incorrect password"
      case "auth/email-already-in-use":
        return "Email already in use"
      case "auth/weak-password":
        return "Password is too weak"
      case "auth/invalid-email":
        return "Invalid email address"
      case "auth/too-many-requests":
        return "Too many failed login attempts. Please try again later"
      case "auth/network-request-failed":
        return "Network connection error. Please check your internet connection and try again."
      case "auth/operation-not-allowed":
        return "Email/password registration is not enabled. Please contact support."
      default:
        return "An error occurred. Please try again"
    }
  }

  // Provide the auth context value to children
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isAdmin,
        loading,
        login,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

