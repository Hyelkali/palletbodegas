import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "../firebase/config"

// Orders
export const getOrders = async () => {
  try {
    const ordersSnapshot = await getDocs(collection(db, "orders"))
    const orders = []

    ordersSnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return orders
  } catch (error) {
    console.error("Error getting orders:", error)
    throw error
  }
}

export const getOrderById = async (orderId) => {
  try {
    const orderDoc = await getDoc(doc(db, "orders", orderId))

    if (!orderDoc.exists()) {
      throw new Error("Order not found")
    }

    return {
      id: orderDoc.id,
      ...orderDoc.data(),
    }
  } catch (error) {
    console.error("Error getting order:", error)
    throw error
  }
}

export const createOrder = async (orderData) => {
  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Get the created order
    const newOrder = await getDoc(orderRef)

    return {
      id: newOrder.id,
      ...newOrder.data(),
    }
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export const updateOrderStatus = async (orderId, status, userId) => {
  try {
    const orderRef = doc(db, "orders", orderId)

    const updateData = {
      status,
      updatedAt: serverTimestamp(),
    }

    if (status === "approved") {
      updateData.approvedBy = userId
      updateData.approvedAt = serverTimestamp()
    } else if (status === "rejected") {
      updateData.rejectedBy = userId
      updateData.rejectedAt = serverTimestamp()
    }

    await updateDoc(orderRef, updateData)

    // Get the updated order
    const updatedOrder = await getDoc(orderRef)

    return {
      id: updatedOrder.id,
      ...updatedOrder.data(),
    }
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}

// Users
export const getUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))

    if (!userDoc.exists()) {
      throw new Error("User not found")
    }

    return {
      uid: userId,
      ...userDoc.data(),
    }
  } catch (error) {
    console.error("Error getting user:", error)
    throw error
  }
}

export const updateUserRole = async (userId, role) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      role,
      updatedAt: serverTimestamp(),
    })

    return true
  } catch (error) {
    console.error("Error updating user role:", error)
    throw error
  }
}

// Get pending orders for admin dashboard
export const getPendingOrders = async () => {
  try {
    const q = query(collection(db, "orders"), where("status", "==", "pending"), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    const pendingOrders = []

    querySnapshot.forEach((doc) => {
      pendingOrders.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return pendingOrders
  } catch (error) {
    console.error("Error getting pending orders:", error)
    throw error
  }
}



// // Mock data storage
// let orders = []

// // Orders
// export const getOrders = async () => {
//   // Get orders from localStorage
//   const storedOrders = localStorage.getItem("orders")
//   if (storedOrders) {
//     orders = JSON.parse(storedOrders)
//   }
//   return orders
// }

// export const getOrderById = async (orderId) => {
//   // Get orders from localStorage
//   const storedOrders = localStorage.getItem("orders")
//   if (storedOrders) {
//     orders = JSON.parse(storedOrders)
//   }

//   const order = orders.find((o) => o.id === orderId)
//   if (!order) {
//     throw new Error("Order not found")
//   }

//   return order
// }

// export const createOrder = async (orderData) => {
//   // Get orders from localStorage
//   const storedOrders = localStorage.getItem("orders")
//   if (storedOrders) {
//     orders = JSON.parse(storedOrders)
//   }

//   const orderId = `order_${Date.now()}`
//   const newOrder = {
//     id: orderId,
//     ...orderData,
//     status: "pending",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   }

//   orders.push(newOrder)
//   localStorage.setItem("orders", JSON.stringify(orders))

//   return newOrder
// }

// export const updateOrderStatus = async (orderId, status, userId) => {
//   // Get orders from localStorage
//   const storedOrders = localStorage.getItem("orders")
//   if (storedOrders) {
//     orders = JSON.parse(storedOrders)
//   }

//   const orderIndex = orders.findIndex((o) => o.id === orderId)
//   if (orderIndex === -1) {
//     throw new Error("Order not found")
//   }

//   const updatedOrder = {
//     ...orders[orderIndex],
//     status,
//     updatedAt: new Date().toISOString(),
//   }

//   if (status === "approved") {
//     updatedOrder.approvedBy = userId
//     updatedOrder.approvedAt = new Date().toISOString()
//   } else if (status === "rejected") {
//     updatedOrder.rejectedBy = userId
//     updatedOrder.rejectedAt = new Date().toISOString()
//   }

//   orders[orderIndex] = updatedOrder
//   localStorage.setItem("orders", JSON.stringify(orders))

//   return updatedOrder
// }

// // Users
// export const getUserById = async (userId) => {
//   // Check predefined users
//   const predefinedUsers = [
//     {
//       uid: "admin123",
//       email: "admin@palletbodega.com",
//       role: "admin",
//       createdAt: new Date().toISOString(),
//     },
//     {
//       uid: "user123",
//       email: "user@example.com",
//       role: "customer",
//       createdAt: new Date().toISOString(),
//     },
//   ]

//   const predefinedUser = predefinedUsers.find((u) => u.uid === userId)
//   if (predefinedUser) {
//     return predefinedUser
//   }

//   // Check registered users
//   const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
//   const user = registeredUsers.find((u) => u.uid === userId)

//   if (!user) {
//     throw new Error("User not found")
//   }

//   // Remove password before returning
//   const { password, ...userWithoutPassword } = user
//   return userWithoutPassword
// }

// export const updateUserRole = async (userId, role) => {
//   // Check registered users
//   const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
//   const userIndex = registeredUsers.findIndex((u) => u.uid === userId)

//   if (userIndex >= 0) {
//     registeredUsers[userIndex].role = role
//     localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
//   }

//   // If it's the current user, update the current user in localStorage
//   const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null")
//   if (currentUser && currentUser.uid === userId) {
//     currentUser.role = role
//     localStorage.setItem("currentUser", JSON.stringify(currentUser))
//   }

//   return true
// }

