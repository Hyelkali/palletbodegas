"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, getDocs, where, limit, startAfter, doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase/config"
import "./Transactions.css"

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Pagination
  const [lastVisible, setLastVisible] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const pageSize = 10

  // Filters
  const [filters, setFilters] = useState({
    status: "",
    dateFrom: "",
    dateTo: "",
    searchTerm: "",
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async (isNextPage = false) => {
    try {
      setLoading(true)

      let transactionsQuery = query(collection(db, "transactions"), orderBy("createdAt", "desc"), limit(pageSize))

      // Apply filters if they exist
      if (filters.status) {
        transactionsQuery = query(transactionsQuery, where("status", "==", filters.status))
      }

      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom)
        transactionsQuery = query(transactionsQuery, where("createdAt", ">=", fromDate))
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999) // End of day
        transactionsQuery = query(transactionsQuery, where("createdAt", "<=", toDate))
      }

      // For pagination
      if (isNextPage && lastVisible) {
        transactionsQuery = query(transactionsQuery, startAfter(lastVisible))
      }

      const querySnapshot = await getDocs(transactionsQuery)

      // Set last document for pagination
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
      setLastVisible(lastDoc)
      setHasMore(querySnapshot.docs.length === pageSize)

      if (isNextPage) {
        setCurrentPage(currentPage + 1)
      } else {
        setCurrentPage(1)
      }

      const transactionsData = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        transactionsData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        })
      })

      // Apply search filter client-side (if needed)
      let filteredData = transactionsData
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase()
        filteredData = transactionsData.filter(
          (transaction) =>
            transaction.id.toLowerCase().includes(searchTerm) ||
            transaction.customerEmail?.toLowerCase().includes(searchTerm) ||
            transaction.transactionId?.toLowerCase().includes(searchTerm),
        )
      }

      if (isNextPage) {
        setTransactions((prev) => [...prev, ...filteredData])
      } else {
        setTransactions(filteredData)
      }
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError("Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }

  const handleViewTransaction = async (transactionId) => {
    try {
      setLoading(true)
      const transactionDoc = await getDoc(doc(db, "transactions", transactionId))

      if (transactionDoc.exists()) {
        const transactionData = {
          id: transactionDoc.id,
          ...transactionDoc.data(),
          createdAt: transactionDoc.data().createdAt?.toDate() || new Date(),
        }

        setSelectedTransaction(transactionData)
        setIsModalOpen(true)
      } else {
        setError("Transaction not found")
      }
    } catch (err) {
      console.error("Error fetching transaction details:", err)
      setError("Failed to load transaction details")
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTransaction(null)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const applyFilters = () => {
    fetchTransactions()
  }

  const resetFilters = () => {
    setFilters({
      status: "",
      dateFrom: "",
      dateTo: "",
      searchTerm: "",
    })
    fetchTransactions()
  }

  const loadMoreTransactions = () => {
    fetchTransactions(true)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "success":
        return "status-success"
      case "pending":
        return "status-pending"
      case "failed":
        return "status-failed"
      default:
        return ""
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString()
  }

  return (
    <div className="transactions-page">
      <h1 className="page-title">Transaction History</h1>

      <div className="transactions-filters">
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">From Date</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">To Date</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Search</label>
          <input
            type="text"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            placeholder="Transaction ID, Email..."
            className="filter-input"
          />
        </div>

        <div className="filter-actions">
          <button onClick={applyFilters} className="filter-button">
            Apply Filters
          </button>
          <button onClick={resetFilters} className="filter-button secondary">
            Reset
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && transactions.length === 0 ? (
        <div className="loading-indicator">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">No transactions found</div>
      ) : (
        <>
          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.transactionId || transaction.id.substring(0, 8)}</td>
                    <td>{formatDate(transaction.createdAt)}</td>
                    <td>{transaction.customerEmail}</td>
                    <td>${transaction.amount?.toFixed(2) || "N/A"}</td>
                    <td>{transaction.paymentMethod || "N/A"}</td>
                    <td>
                      <span className={`transaction-status ${getStatusClass(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>
                      <button className="view-details-button" onClick={() => handleViewTransaction(transaction.id)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="pagination">
              <button className="pagination-button" onClick={loadMoreTransactions} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}

      {isModalOpen && selectedTransaction && (
        <div className="modal-overlay">
          <div className="modal-content transaction-modal">
            <div className="modal-header">
              <h2>Transaction Details</h2>
              <button className="close-modal" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="transaction-details">
              <div className="transaction-info">
                <div className="info-group">
                  <h3>Transaction Information</h3>
                  <p>
                    <span>Transaction ID:</span>
                    <span>{selectedTransaction.transactionId || selectedTransaction.id}</span>
                  </p>
                  <p>
                    <span>Date:</span>
                    <span>{formatDate(selectedTransaction.createdAt)}</span>
                  </p>
                  <p>
                    <span>Status:</span>
                    <span className={getStatusClass(selectedTransaction.status)}>{selectedTransaction.status}</span>
                  </p>
                  <p>
                    <span>Amount:</span>
                    <span>${selectedTransaction.amount?.toFixed(2) || "N/A"}</span>
                  </p>
                  <p>
                    <span>Payment Method:</span>
                    <span>{selectedTransaction.paymentMethod || "N/A"}</span>
                  </p>
                </div>

                <div className="info-group">
                  <h3>Customer Information</h3>
                  <p>
                    <span>Email:</span>
                    <span>{selectedTransaction.customerEmail}</span>
                  </p>
                  <p>
                    <span>Customer ID:</span>
                    <span>{selectedTransaction.customerId || "N/A"}</span>
                  </p>
                  {selectedTransaction.customerName && (
                    <p>
                      <span>Name:</span>
                      <span>{selectedTransaction.customerName}</span>
                    </p>
                  )}
                </div>
              </div>

              {selectedTransaction.errorMessage && (
                <div className="error-details">
                  <h3>Error Information</h3>
                  <p className="error-message">{selectedTransaction.errorMessage}</p>
                </div>
              )}

              {selectedTransaction.responseData && (
                <div className="transaction-response">
                  <h3 className="response-title">Flutterwave Response</h3>
                  <pre className="response-code">{JSON.stringify(selectedTransaction.responseData, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions

