import { collection, addDoc, serverTimestamp, query, getDocs, orderBy } from "firebase/firestore"
import { db } from "../firebase/config"

// Initialize a throttle map to prevent too many records for the same user/page
const throttleMap = new Map()
const THROTTLE_TIME = 5 * 60 * 1000 // 5 minutes in milliseconds

// Initialize visitor tracking
export const initVisitorTracking = () => {
  // Track initial page load
  trackVisitor(window.location.pathname)

  // Set up history change listener for SPA navigation
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  history.pushState = function () {
    originalPushState.apply(this, arguments)
    trackPageChange()
  }

  history.replaceState = function () {
    originalReplaceState.apply(this, arguments)
    trackPageChange()
  }

  window.addEventListener("popstate", trackPageChange)

  // Track page changes
  function trackPageChange() {
    trackVisitor(window.location.pathname)
  }
}

// Track a visitor
export const trackVisitor = async (page) => {
  try {
    // Get visitor information
    const visitorInfo = await getVisitorInfo(page)

    // Check throttle to avoid too many records for the same user/page
    const throttleKey = `${visitorInfo.ip}-${page}`
    const lastRecord = throttleMap.get(throttleKey)
    const now = Date.now()

    if (lastRecord && now - lastRecord < THROTTLE_TIME) {
      console.log("Visitor tracking throttled for", throttleKey)
      return visitorInfo
    }

    // Update throttle map
    throttleMap.set(throttleKey, now)

    // Save to Firestore
    await addDoc(collection(db, "visitors"), {
      ...visitorInfo,
      timestamp: serverTimestamp(),
    })

    console.log("Visitor tracked:", visitorInfo)
    return visitorInfo
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return {
      ip: "unknown",
      location: "unknown",
      page,
      device: getBrowserInfo(),
      timestamp: new Date(),
    }
  }
}

// Get visitor statistics
export const getVisitorStats = async () => {
  try {
    const visitorsRef = collection(db, "visitors")
    const visitorDocs = await getDocs(query(visitorsRef, orderBy("timestamp", "desc")))

    const visitors = visitorDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    }))

    // Calculate statistics
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const todayVisits = visitors.filter((v) => v.timestamp >= today).length
    const weekVisits = visitors.filter((v) => v.timestamp >= lastWeek).length
    const uniqueIPs = new Set(visitors.map((v) => v.ip)).size

    return {
      totalVisits: visitors.length,
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

// Get visitor information
const getVisitorInfo = async (page) => {
  try {
    // Get IP and location info from ipapi.co (free API)
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()

    return {
      ip: data.ip || "unknown",
      location: data.city && data.country ? `${data.city}, ${data.country}` : "unknown",
      page,
      device: getBrowserInfo(),
      referrer: document.referrer || "direct",
      timestamp: new Date(),
    }
  } catch (error) {
    console.error("Error getting visitor info:", error)
    return {
      ip: "unknown",
      location: "unknown",
      page,
      device: getBrowserInfo(),
      referrer: document.referrer || "direct",
      timestamp: new Date(),
    }
  }
}

// Get browser and device information
const getBrowserInfo = () => {
  const ua = navigator.userAgent
  let browser = "Unknown"
  let device = "Unknown"

  // Detect browser
  if (ua.indexOf("Chrome") > -1) browser = "Chrome"
  else if (ua.indexOf("Safari") > -1) browser = "Safari"
  else if (ua.indexOf("Firefox") > -1) browser = "Firefox"
  else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1) browser = "Internet Explorer"
  else if (ua.indexOf("Edge") > -1) browser = "Edge"

  // Detect device type
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device = "Tablet"
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)
  ) {
    device = "Mobile"
  } else {
    device = "Desktop"
  }

  return `${device} - ${browser}`
}

