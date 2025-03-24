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

    // Create a transaction record
    if (orderData.transactionId) {
      await addDoc(collection(db, "transactions"), {
        orderId: orderRef.id,
        transactionId: orderData.transactionId,
        customerEmail: orderData.customerEmail,
        customerId: orderData.customerId,
        amount: orderData.totalAmount,
        paymentMethod: orderData.paymentMethod || "flutterwave",
        status: "pending",
        createdAt: serverTimestamp(),
      })
    }

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

    // Update associated transaction if exists
    const transactionsQuery = query(collection(db, "transactions"), where("orderId", "==", orderId))

    const transactionSnapshot = await getDocs(transactionsQuery)

    if (!transactionSnapshot.empty) {
      const transactionDoc = transactionSnapshot.docs[0]
      await updateDoc(doc(db, "transactions", transactionDoc.id), {
        status: status === "approved" ? "success" : status === "rejected" ? "failed" : "pending",
        updatedAt: serverTimestamp(),
      })
    }

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

// Verify payment transaction
export const verifyTransaction = async (transactionId) => {
  try {
    // In a real implementation, you would call Flutterwave API to verify the transaction
    // For demo purposes, we'll simulate a successful verification
    const verificationResult = {
      status: "success",
      transactionId,
      amount: 100.0,
      currency: "USD",
      customer: {
        email: "customer@example.com",
      },
    }

    // Record the verification result
    const transactionsQuery = query(collection(db, "transactions"), where("transactionId", "==", transactionId))

    const transactionSnapshot = await getDocs(transactionsQuery)

    if (!transactionSnapshot.empty) {
      const transactionDoc = transactionSnapshot.docs[0]
      await updateDoc(doc(db, "transactions", transactionDoc.id), {
        status: verificationResult.status,
        responseData: verificationResult,
        updatedAt: serverTimestamp(),
      })
    }

    return verificationResult
  } catch (error) {
    console.error("Error verifying transaction:", error)

    // Record the error
    const transactionsQuery = query(collection(db, "transactions"), where("transactionId", "==", transactionId))

    const transactionSnapshot = await getDocs(transactionsQuery)

    if (!transactionSnapshot.empty) {
      const transactionDoc = transactionSnapshot.docs[0]
      await updateDoc(doc(db, "transactions", transactionDoc.id), {
        status: "failed",
        errorMessage: error.message || "Verification failed",
        updatedAt: serverTimestamp(),
      })
    }

    throw error
  }
}

// Get transactions
export const getTransactions = async () => {
  try {
    const transactionsSnapshot = await getDocs(query(collection(db, "transactions"), orderBy("createdAt", "desc")))

    const transactions = []

    transactionsSnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })
    })

    return transactions
  } catch (error) {
    console.error("Error getting transactions:", error)
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

