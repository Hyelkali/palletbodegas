"use client"

import { useState, useEffect, useRef } from "react"
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  where,
} from "firebase/firestore"
import { db } from "../../firebase/config"
import "./ChatSupport.css"

const AdminChatSupport = () => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  // Fetch all conversations
  useEffect(() => {
    const q = query(collection(db, "conversations"), orderBy("updatedAt", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const conversationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      }))
      setConversations(conversationsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return

    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", selectedConversation.id),
      orderBy("timestamp", "asc"),
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }))
      setMessages(messagesData)

      // Mark all unread messages as read
      messagesData.forEach((message) => {
        if (!message.isRead && message.sender !== "admin") {
          updateDoc(doc(db, "messages", message.id), {
            isRead: true,
          })
        }
      })
    })

    return () => unsubscribe()
  }, [selectedConversation])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedConversation) return

    try {
      // Add message to Firestore
      await addDoc(collection(db, "messages"), {
        conversationId: selectedConversation.id,
        content: newMessage,
        sender: "admin",
        timestamp: serverTimestamp(),
        isRead: true,
      })

      // Update conversation's last message and timestamp
      await updateDoc(doc(db, "conversations", selectedConversation.id), {
        lastMessage: newMessage,
        updatedAt: serverTimestamp(),
      })

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString()
  }

  const getUnreadCount = (conversation) => {
    return messages.filter((m) => m.conversationId === conversation.id && !m.isRead && m.sender !== "admin").length
  }

  return (
    <div className="admin-chat-support">
      <div className="container">
        <h1 className="page-title">Customer Support</h1>

        <div className="chat-dashboard">
          <div className="conversations-panel">
            <h2 className="panel-title">Conversations</h2>

            {loading ? (
              <div className="loading-indicator">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="empty-state">No conversations yet</div>
            ) : (
              <div className="conversations-list">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`conversation-item ${selectedConversation?.id === conversation.id ? "active" : ""}`}
                    onClick={() => selectConversation(conversation)}
                  >
                    <div className="conversation-avatar">
                      {conversation.customerEmail?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="conversation-details">
                      <div className="conversation-header">
                        <span className="conversation-name">{conversation.customerEmail || "Anonymous"}</span>
                        <span className="conversation-time">{formatDate(conversation.updatedAt)}</span>
                      </div>
                      <div className="conversation-preview">{conversation.lastMessage || "No messages yet"}</div>
                    </div>
                    {getUnreadCount(conversation) > 0 && (
                      <div className="unread-badge">{getUnreadCount(conversation)}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="messages-panel">
            {selectedConversation ? (
              <>
                <div className="messages-header">
                  <h2 className="customer-name">{selectedConversation.customerEmail || "Anonymous"}</h2>
                </div>

                <div className="messages-container">
                  {messages.length === 0 ? (
                    <div className="empty-state">No messages in this conversation</div>
                  ) : (
                    <div className="messages-list">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`message ${message.sender === "admin" ? "admin-message" : "customer-message"}`}
                        >
                          <div className="message-content">{message.content}</div>
                          <div className="message-time">{formatTime(message.timestamp)}</div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                <form className="message-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="message-input"
                  />
                  <button type="submit" className="send-button" disabled={!newMessage.trim()}>
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
              </>
            ) : (
              <div className="no-conversation-selected">
                <p>Select a conversation to view messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminChatSupport

