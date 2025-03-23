import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore"
import { db } from "../firebase/config"

// Track a page visit
export const trackVisitor = async (page = window.location.pathname) => {
  try {
    // Get visitor information
    const visitorData = await getVisitorInfo()

    // Add page information
    visitorData.page = page
    visitorData.timestamp = Timestamp.now()
    visitorData.referrer = document.referrer || "Direct"

    // Save to Firestore
    await addDoc(collection(db, "visitors"), visitorData)

    console.log("Visit tracked:", visitorData)
    return visitorData
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return {
      ip: "Unknown",
      location: "Unknown",
      device: getBrowserInfo(),
      browser: navigator.userAgent,
      page,
      timestamp: Timestamp.now(),
      referrer: document.referrer || "Direct",
    }
  }
}

// Get visitor information including IP and location
const getVisitorInfo = async () => {
  try {
    // Use ipapi.co to get IP and location (free tier)
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()

    return {
      ip: data.ip || "Unknown",
      location: data.city && data.country ? `${data.city}, ${data.country}` : "Unknown",
      region: data.region || "Unknown",
      country: data.country_name || "Unknown",
      latitude: data.latitude,
      longitude: data.longitude,
      device: getBrowserInfo(),
      browser: navigator.userAgent,
    }
  } catch (error) {
    console.error("Error getting visitor info:", error)
    return {
      ip: "Unknown",
      location: "Unknown",
      device: getBrowserInfo(),
      browser: navigator.userAgent,
    }
  }
}

// Get browser and device information
const getBrowserInfo = () => {
  const userAgent = navigator.userAgent

  // Detect mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

  // Detect browser
  let browserName = "Unknown"
  if (userAgent.indexOf("Firefox") > -1) {
    browserName = "Firefox"
  } else if (userAgent.indexOf("SamsungBrowser") > -1) {
    browserName = "Samsung Browser"
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    browserName = "Opera"
  } else if (userAgent.indexOf("Trident") > -1) {
    browserName = "Internet Explorer"
  } else if (userAgent.indexOf("Edge") > -1) {
    browserName = "Edge"
  } else if (userAgent.indexOf("Chrome") > -1) {
    browserName = "Chrome"
  } else if (userAgent.indexOf("Safari") > -1) {
    browserName = "Safari"
  }

  return isMobile ? `Mobile (${browserName})` : `Desktop (${browserName})`
}

// Get visitor statistics
export const getVisitorStats = async () => {
  try {
    const visitorsRef = collection(db, "visitors")

    // Get total visits
    const totalVisitsQuery = query(visitorsRef)
    const totalVisitsSnapshot = await getDocs(totalVisitsQuery)
    const totalVisits = totalVisitsSnapshot.size

    // Get today's visits
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTimestamp = Timestamp.fromDate(today)

    const todayVisitsQuery = query(visitorsRef, where("timestamp", ">=", todayTimestamp))
    const todayVisitsSnapshot = await getDocs(todayVisitsQuery)
    const todayVisits = todayVisitsSnapshot.size

    // Get last 7 days visits
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    lastWeek.setHours(0, 0, 0, 0)
    const lastWeekTimestamp = Timestamp.fromDate(lastWeek)

    const weekVisitsQuery = query(visitorsRef, where("timestamp", ">=", lastWeekTimestamp))
    const weekVisitsSnapshot = await getDocs(weekVisitsQuery)
    const weekVisits = weekVisitsSnapshot.size

    // Get unique IPs
    const allVisits = totalVisitsSnapshot.docs.map((doc) => doc.data())
    const uniqueIPs = new Set(allVisits.map((visit) => visit.ip)).size

    return {
      totalVisits,
      todayVisits,
      weekVisits,
      uniqueIPs,
    }
  } catch (error) {
    console.error("Error getting visitor stats:", error)
    return {
      totalVisits: 0,
      todayVisits: 0,
      weekVisits: 0,
      uniqueIPs: 0,
    }
  }
}

// Get recent visitors
export const getRecentVisitors = async (limit = 50) => {
  try {
    const visitorsRef = collection(db, "visitors")

    const recentVisitorsQuery = query(visitorsRef, orderBy("timestamp", "desc"), limit(limit))

    const snapshot = await getDocs(recentVisitorsQuery)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    }))
  } catch (error) {
    console.error("Error getting recent visitors:", error)
    return []
  }
}

// Initialize tracking on page load
export const initVisitorTracking = () => {
  // Track initial page load
  trackVisitor()

  // Track page changes (for single page apps)
  let lastTrackedPath = window.location.pathname

  // Check for path changes every 2 seconds
  setInterval(() => {
    const currentPath = window.location.pathname
    if (currentPath !== lastTrackedPath) {
      trackVisitor(currentPath)
      lastTrackedPath = currentPath
    }
  }, 2000)
}

