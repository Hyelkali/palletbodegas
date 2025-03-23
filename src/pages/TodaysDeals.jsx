"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { getProductsOnSale } from "../api/products"
import "./TodaysDeals.css"

const TodaysDeals = () => {
  const [dealProducts, setDealProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDealProducts = async () => {
      try {
        setIsLoading(true)
        const products = await getProductsOnSale()
        setDealProducts(products)
      } catch (error) {
        console.error("Error fetching deal products:", error)
        setError("Failed to load deals. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDealProducts()
  }, [])

  return (
    <div className="todays-deals-page">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Amazon Liquations Clearance</h1>
            <p>
              Don't miss out on our massive Amazon clearance sale! Get unbeatable deals with 50% to 80% off on top
              items, including electronics, home essentials, toys, and more. Limited stock at these prices - grab your
              favorites before they're gone!
            </p>
            <a href="#featured-collection" className="shop-now-btn">
              Shop Now
            </a>
          </div>
        </div>
      </div>

      {/* Featured Collection */}
      <div className="container">
        <section id="featured-collection" className="featured-collection">
          <h2 className="section-title">Featured collection</h2>

          {error && <div className="error-message">{error}</div>}

          {isLoading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="product-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-price"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {dealProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="view-all-container">
            <Link to="/catalog" className="view-all-link">
              View all
            </Link>
          </div>
        </section>

        {/* Today's Deals Section */}
        <section className="todays-deals-section">
          <h2 className="section-title-centered">Today's Deals</h2>
          <p className="deals-subtitle">Amazon Liquidation Deals</p>

          {error && <div className="error-message">{error}</div>}

          {isLoading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="product-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-price"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {dealProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default TodaysDeals

