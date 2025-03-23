"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase/config"
import "./Products.css"

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    description: "",
    imageUrl: "",
    soldOut: false,
    sale: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, "products"))
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setProducts(productsData)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const openModal = (product = null) => {
    if (product) {
      setCurrentProduct(product)
      setFormData({
        name: product.name,
        price: product.price.toString(),
        originalPrice: product.originalPrice ? product.originalPrice.toString() : "",
        description: product.description || "",
        imageUrl: product.imageUrl || "",
        soldOut: product.soldOut || false,
        sale: product.sale || false,
      })
    } else {
      setCurrentProduct(null)
      setFormData({
        name: "",
        price: "",
        originalPrice: "",
        description: "",
        imageUrl: "",
        soldOut: false,
        sale: false,
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentProduct(null)
    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      description: "",
      imageUrl: "",
      soldOut: false,
      sale: false,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.price) {
      setError("Name and price are required")
      return
    }

    try {
      setIsSubmitting(true)

      // Use placeholder image if no image URL is provided
      const imageUrl =
        formData.imageUrl || `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(formData.name)}`

      const productData = {
        name: formData.name,
        price: Number.parseFloat(formData.price),
        originalPrice: formData.originalPrice ? Number.parseFloat(formData.originalPrice) : null,
        description: formData.description,
        imageUrl: imageUrl,
        soldOut: formData.soldOut,
        sale: formData.sale,
        updatedAt: serverTimestamp(),
      }

      if (currentProduct) {
        // Update existing product
        await updateDoc(doc(db, "products", currentProduct.id), productData)

        // Update local state
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.id === currentProduct.id ? { ...p, ...productData } : p)),
        )
      } else {
        // Add new product
        const docRef = await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: serverTimestamp(),
        })

        // Update local state
        setProducts((prevProducts) => [...prevProducts, { id: docRef.id, ...productData }])
      }

      closeModal()
    } catch (err) {
      console.error("Error saving product:", err)
      setError("Failed to save product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      await deleteDoc(doc(db, "products", productId))

      // Update local state
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId))
    } catch (err) {
      console.error("Error deleting product:", err)
      setError("Failed to delete product")
    }
  }

  return (
    <div className="admin-products">
      <div className="container">
        <div className="products-header">
          <h1 className="page-title">Manage Products</h1>
          <button className="add-product-btn" onClick={() => openModal()}>
            Add New Product
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-indicator">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">No products found. Add your first product!</div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card admin-product-card">
                <div className="product-image-container">
                  <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} className="product-image" />
                  {product.soldOut && <span className="product-badge sold-out">Sold out</span>}
                  {product.sale && <span className="product-badge sale">Sale</span>}
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
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
                </div>

                <div className="product-actions">
                  <button className="edit-button" onClick={() => openModal(product)}>
                    Edit
                  </button>
                  <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{currentProduct ? "Edit Product" : "Add New Product"}</h2>
                <button className="close-modal" onClick={closeModal}>
                  ×
                </button>
              </div>

              <form className="product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="originalPrice">Original Price ($) (optional)</label>
                    <input
                      type="number"
                      id="originalPrice"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="imageUrl">Image URL (external image link)</label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="form-help">
                    Enter a URL to an image hosted elsewhere. If left blank, a placeholder will be used.
                  </p>
                </div>

                {formData.imageUrl && (
                  <div className="image-preview">
                    <img src={formData.imageUrl || "/placeholder.svg"} alt="Preview" />
                  </div>
                )}

                <div className="form-row checkbox-row">
                  <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      id="soldOut"
                      name="soldOut"
                      checked={formData.soldOut}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="soldOut">Sold Out</label>
                  </div>

                  <div className="form-group checkbox-group">
                    <input type="checkbox" id="sale" name="sale" checked={formData.sale} onChange={handleInputChange} />
                    <label htmlFor="sale">On Sale</label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="save-button" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products

