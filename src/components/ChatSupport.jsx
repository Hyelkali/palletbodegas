"use client"

import { useState, useEffect, useRef } from "react"
import { useChat } from "../context/ChatContext"
import "./ChatSupport.css"

const ChatSupport = () => {
  const { isChatOpen, messages, unreadCount, openChat, closeChat, sendMessage } = useChat()
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    sendMessage(newMessage)
    setNewMessage("")
  }

  if (!isChatOpen) {
    return (
      <button className="chat-button" onClick={openChat}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        {unreadCount > 0 && <span className="chat-badge">{unreadCount}</span>}
      </button>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3 className="chat-title">Support Chat</h3>
        <button className="chat-close" onClick={closeChat}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <p>Welcome to our support chat! How can we help you today?</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.sender === "user" ? "user-message" : "support-message"}`}
            >
              <div className="message-content">{message.content}</div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="chat-send">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  )
}

export default ChatSupport

