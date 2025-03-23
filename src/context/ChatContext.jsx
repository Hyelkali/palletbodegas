"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ChatContext = createContext()

export const useChat = () => useContext(ChatContext)

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Load chat history from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages")
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error("Error parsing chat messages from localStorage:", error)
      }
    }
  }, [])

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages))
  }, [messages])

  // Update unread count when new messages arrive and chat is closed
  useEffect(() => {
    if (!isChatOpen) {
      const newUnreadCount = messages.filter((msg) => !msg.isRead && msg.sender === "support").length
      setUnreadCount(newUnreadCount)
    } else {
      // Mark all messages as read when chat is open
      setMessages((prevMessages) => prevMessages.map((msg) => ({ ...msg, isRead: true })))
      setUnreadCount(0)
    }
  }, [messages, isChatOpen])

  const openChat = () => {
    setIsChatOpen(true)
    // Mark all messages as read when chat is opened
    setMessages((prevMessages) => prevMessages.map((msg) => ({ ...msg, isRead: true })))
    setUnreadCount(0)
  }

  const closeChat = () => {
    setIsChatOpen(false)
  }

  const sendMessage = (content) => {
    const newMessage = {
      id: Date.now(),
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
      isRead: true,
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])

    // Simulate support response after a delay
    setTimeout(() => {
      const supportMessage = {
        id: Date.now() + 1,
        content: "Thank you for your message! Our support team will get back to you shortly.",
        sender: "support",
        timestamp: new Date().toISOString(),
        isRead: isChatOpen,
      }

      setMessages((prevMessages) => [...prevMessages, supportMessage])
    }, 1000)
  }

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        messages,
        unreadCount,
        openChat,
        closeChat,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

