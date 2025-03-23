import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"

/**
 * Sets a user's role to admin in Firestore
 * @param {string} userId - The Firebase user ID
 * @returns {Promise<void>}
 */
export const setUserAsAdmin = async (userId) => {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      role: "admin",
      updatedAt: new Date().toISOString(),
    })
    console.log(`User ${userId} has been set as admin. Please log out and log back in.`)
    return true
  } catch (error) {
    console.error("Error setting user as admin:", error)
    throw error
  }
}

