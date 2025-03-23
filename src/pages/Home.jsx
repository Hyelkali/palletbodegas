"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { getFeaturedProducts } from "../api/products"
import "./Home.css"

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true)
        const products = await getFeaturedProducts()
        setFeaturedProducts(products)
      } catch (error) {
        console.error("Error fetching featured products:", error)
        setError("Failed to load products. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const handleViewProduct = (id) => {
    navigate(`/product/${id}`)
  }

  return (
    <div className="home-page">
      <div className="container">
        <div className="products-section">
          <div className="products-grid">
            {isLoading ? (
              // Loading skeletons
              [...Array(4)].map((_, index) => (
                <div key={index} className="product-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-price"></div>
                </div>
              ))
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              // Product cards
              featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)
            )}
          </div>
        </div>

        <div className="featured-product">
          <div className="featured-product-grid">
            <div className="featured-product-image">
              <img src="https://www.palletbodega.com/cdn/shop/files/Export_photo_1.png?v=1728588280&width=990?height=400&width=400&text=Clothing+Box+1" alt="Sam's Club Clothing Box" />
            </div>

            <div className="featured-product-details">
              <div className="featured-product-header">
                <span className="featured-product-vendor">PALLET BODEGA</span>
                <h2 className="featured-product-title">Sam's Club Clothing Box (Random Brand Pulls)</h2>
              </div>

              <div className="featured-product-price">
                <span>$400.00 USD</span>
              </div>

              <div className="featured-product-actions">
                <div className="quantity-selector">
                  <button className="quantity-btn decrease">-</button>
                  <input type="number" value="1" min="1" className="quantity-input" readOnly />
                  <button className="quantity-btn increase">+</button>
                </div>

                <button className="add-to-cart-btn">Add to cart</button>

                <button className="shop-pay-btn">
                  Buy with <span className="shop-pay-text">Shop</span>
                  <span className="shop-pay-text-bold">Pay</span>
                </button>

                <button className="more-payment-options">More payment options</button>
              </div>

              <div className="featured-product-footer">
                <button className="share-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Share
                </button>

                <Link to="/product/11" className="view-details-link">
                  View full details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

