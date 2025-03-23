"use client"

import { useState, useEffect } from "react"
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore"
import { db } from "../../firebase/config"
import "./Viewers.css"

const Viewers = () => {
  const [visitors, setVisitors] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    lastWeek: 0,
    uniqueIPs: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      // Set up real-time listener for visitors
      const visitorsRef = collection(db, "visitors")
      const visitorsQuery = query(visitorsRef, orderBy("timestamp", "desc"), limit(100))

      const unsubscribe = onSnapshot(
        visitorsQuery,
        (snapshot) => {
          const visitorData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
          }))

          setVisitors(visitorData)

          // Calculate statistics
          const now = new Date()
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

          const todayVisits = visitorData.filter((v) => v.timestamp >= today).length
          const lastWeekVisits = visitorData.filter((v) => v.timestamp >= lastWeek).length
          const uniqueIPs = new Set(visitorData.map((v) => v.ip)).size

          setStats({
            total: visitorData.length,
            today: todayVisits,
            lastWeek: lastWeekVisits,
            uniqueIPs,
          })

          setLoading(false)
        },
        (error) => {
          console.error("Error fetching visitors:", error)
          setLoading(false)
        },
      )

      return () => unsubscribe()
    } catch (error) {
      console.error("Error setting up visitor listener:", error)
      setLoading(false)
    }
  }, [])

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleString()
  }

  return (
    <div className="viewers-container">
      <h1>Site Visitors</h1>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Visits</h3>
          <p className="stat-value">{stats.total}</p>
        </div>

        <div className="stat-card">
          <h3>Today's Visits</h3>
          <p className="stat-value">{stats.today}</p>
        </div>

        <div className="stat-card">
          <h3>Last 7 Days</h3>
          <p className="stat-value">{stats.lastWeek}</p>
        </div>

        <div className="stat-card">
          <h3>Unique IPs</h3>
          <p className="stat-value">{stats.uniqueIPs}</p>
        </div>
      </div>

      <div className="visitors-table-container">
        <h2>Recent Visitors</h2>

        {loading ? (
          <p>Loading visitor data...</p>
        ) : visitors.length === 0 ? (
          <p>No visitors recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="visitors-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>IP Address</th>
                  <th>Location</th>
                  <th>Page</th>
                  <th>Device</th>
                  <th>Referrer</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((visitor) => (
                  <tr key={visitor.id}>
                    <td>{formatDate(visitor.timestamp)}</td>
                    <td>{visitor.ip || "Unknown"}</td>
                    <td>{visitor.location || "Unknown"}</td>
                    <td>{visitor.page || "/"}</td>
                    <td>{visitor.device || "Unknown"}</td>
                    <td>{visitor.referrer || "Direct"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Viewers

