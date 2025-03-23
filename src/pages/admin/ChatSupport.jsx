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
  getDocs,
} from "firebase/firestore"
import { db } from "../../firebase/config"
import { useAuth } from "../../context/AuthContext"
import "./ChatSupport.css"

const ChatSupport = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)
  const [conversationId, setConversationId] = useState(null)
  const messagesEndRef = useRef(null)
  const { user } = useAuth()

  // Find or create conversation for the current user
  useEffect(() => {
    if (!user) return

    const findOrCreateConversation = async () => {
      // Try to find existing conversation
      const q = query(collection(db, "conversations"), where("customerId", "==", user.uid))

      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        // Use existing conversation
        setConversationId(querySnapshot.docs[0].id)
      } else {
        // Create new conversation
        const newConversationRef = await addDoc(collection(db, "conversations"), {
          customerId: user.uid,
          customerEmail: user.email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })

        setConversationId(newConversationRef.id)
      }
    }

    findOrCreateConversation()
  }, [user])

  // Listen for messages in the current conversation
  useEffect(() => {
    if (!conversationId) return

    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("timestamp", "asc"),
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }))

      setMessages(messagesData)

      // Count unread messages from admin when chat is closed
      if (!isChatOpen) {
        const unread = messagesData.filter((msg) => !msg.isRead && msg.sender === "admin").length

        setUnreadCount(unread)
      } else {
        // Mark messages as read when chat is open
        messagesData.forEach((message) => {
          if (!message.isRead && message.sender === "admin") {
            updateDoc(doc(db, "messages", message.id), {
              isRead: true,
            })
          }
        })

        setUnreadCount(0)
      }
    })

    return () => unsubscribe()
  }, [conversationId, isChatOpen])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isChatOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isChatOpen])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !conversationId) return

    try {
      // Add message to Firestore
      await addDoc(collection(db, "messages"), {
        conversationId,
        content: newMessage,
        sender: "customer",
        timestamp: serverTimestamp(),
        isRead: false,
      })

      // Update conversation's last message and timestamp
      await updateDoc(doc(db, "conversations", conversationId), {
        lastMessage: newMessage,
        updatedAt: serverTimestamp(),
      })

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const openChat = () => {
    setIsChatOpen(true)
  }

  const closeChat = () => {
    setIsChatOpen(false)
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
              className={`chat-message ${message.sender === "customer" ? "user-message" : "support-message"}`}
            >
              <div className="message-content">{message.content}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
        <button type="submit" className="chat-send" disabled={!newMessage.trim()}>
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

