import React, { useState, useCallback, createContext, useContext } from 'react'

const SearchContext = createContext()

export const SearchProvider = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  const openSearch = useCallback(() => {
    setIsSearchOpen(true)
    // Prevent scrolling when search is open
    document.body.style.overflow = 'hidden'
  }, [])
  
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false)
    // Restore scrolling when search is closed
    document.body.style.overflow = ''
  }, [])
  
  return (
    <SearchContext.Provider value={{ isSearchOpen, openSearch, closeSearch }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  
  return context
}