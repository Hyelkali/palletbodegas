"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProductById } from "../api/products"
import { useCart } from "../context/CartContext"
import "./ProductDetail.css"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const data = await getProductById(Number.parseInt(id))
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Product not found or failed to load.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      setAddedToCart(true)

      // Reset the "Added to cart" message after 3 seconds
      setTimeout(() => {
        setAddedToCart(false)
      }, 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-detail-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-price"></div>
              <div className="skeleton-description"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-error">
            <h2>{error || "Product not found"}</h2>
            <button onClick={() => navigate("/catalog")} className="back-button">
              Back to Catalog
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail">
          <div className="product-images">
            <div className="main-image">
              <img src={product.images[0] || "/placeholder.svg?height=600&width=600"} alt={product.name} />
              {product.soldOut && <span className="product-badge sold-out">Sold out</span>}
              {product.sale && <span className="product-badge sale">Sale</span>}
            </div>
          </div>

          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>

            <div className="product-price">
              {product.originalPrice && product.originalPrice > product.price ? (
                <>
                  <span className="price-sale">${product.price.toFixed(2)} USD</span>
                  <span className="price-original">${product.originalPrice.toFixed(2)} USD</span>
                </>
              ) : (
                <span className="price-regular">${product.price.toFixed(2)} USD</span>
              )}
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <button className="quantity-btn decrease" onClick={decreaseQuantity} disabled={product.soldOut}>
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className="quantity-input"
                  disabled={product.soldOut}
                />
                <button className="quantity-btn increase" onClick={increaseQuantity} disabled={product.soldOut}>
                  +
                </button>
              </div>

              <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={product.soldOut}>
                {product.soldOut ? "Sold Out" : "Add to Cart"}
              </button>

              {addedToCart && (
                <div className="added-to-cart">
                  ✓ Added to cart! <button onClick={() => navigate("/cart")}>View Cart</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

