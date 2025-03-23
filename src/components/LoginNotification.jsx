"use client"

import { useState, useEffect } from "react"
import "./EmailTemplates.css"

const LoginNotification = ({
  customerName = "Valued Customer",
  loginTime = new Date(),
  loginLocation = "Unknown Location",
}) => {
  const [formattedTime, setFormattedTime] = useState("")

  useEffect(() => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    setFormattedTime(loginTime.toLocaleDateString(undefined, options))
  }, [loginTime])

  return (
    <div className="email-template">
      <div className="email-container">
        <div className="email-header">
          <img src="/logo.png" alt="PalletBodega Logo" className="email-logo" />
        </div>

        <div className="email-body">
          <h1>New Login Detected</h1>
          <p>Hello {customerName},</p>
          <p>We detected a new login to your PalletBodega account. If this was you, no action is needed.</p>

          <div className="login-details">
            <h2>Login Details:</h2>
            <p>
              <strong>Time:</strong> {formattedTime}
            </p>
            <p>
              <strong>Location:</strong> {loginLocation}
            </p>
          </div>

          <div className="email-security-notice">
            <p>
              If you didn't log in at this time, please <a href="/reset-password">reset your password</a> immediately
              and contact our support team.
            </p>
          </div>

          <div className="email-cta">
            <a href="/account/security" className="email-button">
              Review Account Security
            </a>
          </div>

          <p>Thank you for being a valued customer.</p>
          <p>The PalletBodega Security Team</p>
        </div>

        <div className="email-footer">
          <p>&copy; {new Date().getFullYear()} PalletBodega. All rights reserved.</p>
          <p className="email-unsubscribe">
            This is a security notification and cannot be unsubscribed from.
            <br />
            <a href="#">Manage other email preferences</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginNotification

