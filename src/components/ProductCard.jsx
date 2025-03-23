"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./ProductCard.css"

const ProductCard = ({ product }) => {
  const { id, name, price, originalPrice, images, soldOut, sale } = product
  const [isHovered, setIsHovered] = useState(false)

  // Determine which image to show based on hover state
  const displayImage = isHovered && images.length > 1 ? images[1] : images[0]

  return (
    <div className="product-card" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Link to={`/product/${id}`} className="product-link">
        <div className="product-image-container">
          <img src={displayImage || "/placeholder.svg"} alt={name} className="product-image" />
          {soldOut && <span className="product-badge sold-out">Sold out</span>}
          {sale && <span className="product-badge sale">Sale</span>}
        </div>

        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          <div className="product-price">
            {originalPrice && originalPrice > price ? (
              <>
                <span className="price-original">${originalPrice.toFixed(2)} USD</span>
                <span className="price-sale">${price.toFixed(2)} USD</span>
              </>
            ) : (
              <span className="price-regular">${price.toFixed(2)} USD</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard

