"use client"

import { useState } from "react"
import "./Contact.css"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email) {
      setSubmitError("Email is required")
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      // This would be replaced with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        comment: "",
      })

      setSubmitSuccess(true)

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      setSubmitError("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="page-title">Contact</h1>

        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="contact-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email *"
                  required
                  className="contact-input"
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="contact-input"
              />
            </div>

            <div className="form-group">
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Comment"
                rows="5"
                className="contact-textarea"
              ></textarea>
            </div>

            {submitError && <p className="form-error">{submitError}</p>}
            {submitSuccess && <p className="form-success">Message sent successfully!</p>}

            <button type="submit" className="contact-submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact

