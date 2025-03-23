"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useSearch } from "../hooks/useSearch"
import { searchProducts } from "../api/products"
import "./SearchOverlay.css"

const SearchOverlay = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const { closeSearch } = useSearch()
  const navigate = useNavigate()
  const searchInputRef = useRef(null)

  useEffect(() => {
    // Focus the search input when the overlay opens
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }

    // Add event listener for escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeSearch()
      }
    }

    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [closeSearch])

  useEffect(() => {
    // Search functionality
    const performSearch = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)

      try {
        const results = await searchProducts(searchTerm)
        setSearchResults(results)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }

    // Debounce search to avoid too many requests
    const debounceTimer = setTimeout(() => {
      performSearch()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const handleSearch = (e) => {
    e.preventDefault()

    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
      closeSearch()
    }
  }

  const handleResultClick = (id) => {
    navigate(`/product/${id}`)
    closeSearch()
  }

  return (
    <div className="search-overlay">
      <div className="search-container">
        <div className="search-header">
          <h2 className="search-title">Search</h2>
          <button className="search-close" onClick={closeSearch}>
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-group">
            <input
              type="text"
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="search-input"
            />
            <button type="submit" className="search-submit">
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
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </form>

        {isSearching && (
          <div className="search-loading">
            <div className="search-spinner"></div>
            <p>Searching...</p>
          </div>
        )}

        {!isSearching && searchResults.length > 0 && (
          <div className="search-results">
            <ul className="results-list">
              {searchResults.map((result) => (
                <li key={result.id} className="result-item" onClick={() => handleResultClick(result.id)}>
                  <span className="result-name">{result.name}</span>
                  <span className="result-price">${result.price.toFixed(2)} USD</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isSearching && searchTerm.length >= 2 && searchResults.length === 0 && (
          <div className="no-results">
            <p>No results found for "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchOverlay

