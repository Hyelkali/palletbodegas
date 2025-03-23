import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/config"

// Track a visitor
export const trackVisitor = async (page = window.location.pathname) => {
  try {
    // Get visitor information
    const visitorInfo = await getVisitorInfo()

    // Add page information
    visitorInfo.page = page
    visitorInfo.timestamp = serverTimestamp()
    visitorInfo.referrer = document.referrer || "Direct"

    // Save to Firestore
    await addDoc(collection(db, "visitors"), visitorInfo)

    console.log("Visit tracked:", visitorInfo)
    return visitorInfo
  } catch (error) {
    console.error("Error tracking visitor:", error)
    return {
      ip: "Unknown",
      location: "Unknown",
      device: getBrowserInfo(),
      browser: navigator.userAgent,
      page,
      timestamp: serverTimestamp(),
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
      location: data.city && data.country_name ? `${data.city}, ${data.country_name}` : "Unknown",
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

