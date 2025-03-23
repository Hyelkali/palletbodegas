"use client"

import { useState, useEffect } from "react"
import ProductCard from "../components/ProductCard"
import { getAllProducts } from "../api/products"
import "./Catalog.css"

const Catalog = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const data = await getAllProducts()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Failed to load products. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="catalog-page">
      <div className="container">
        <h1 className="page-title">Products</h1>

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="product-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-price"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Catalog

