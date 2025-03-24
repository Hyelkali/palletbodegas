"use client"

import { useState, useEffect } from "react"
import { CreditCard, Building, Gift, Globe, DollarSign, Euro, Copy, CheckCircle } from "lucide-react"
import "./PaymentGateway.css"

// Payment method types
const PAYMENT_METHODS = {
  CARD: "card",
  BANK_TRANSFER: "bank_transfer",
  NIGERIA: "nigeria",
  UK_EU: "uk_eu",
  ACH: "ach",
  GIFT_CARD: "gift_card",
}

const PaymentGateway = ({ amount, onSuccess, onCancel, customerInfo }) => {
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [bankReference, setBankReference] = useState("")
  const [giftCardCode, setGiftCardCode] = useState("")
  const [copied, setCopied] = useState(false)

  // Initialize Flutterwave when component mounts
  useEffect(() => {
    // Load Flutterwave script
    const script = document.createElement("script")
    script.src = "https://checkout.flutterwave.com/v3.js"
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      // FlutterwaveCheckout is now available
    }

    return () => {
      // Clean up script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleMethodSelect = (method) => {
    setSelectedMethod(method)
    setError("")
    setPaymentInfo(null)
  }

  const handleCardInputChange = (e) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGiftCardChange = (e) => {
    setGiftCardCode(e.target.value.toUpperCase())
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const verifyGiftCard = () => {
    // Simulate gift card verification
    setIsProcessing(true)
    setTimeout(() => {
      if (giftCardCode === "DEMO1234") {
        setPaymentInfo({
          status: "success",
          message: "Gift card verified successfully. Value: $50.00",
          amount: 50.0,
        })
      } else {
        setError("Invalid gift card code or card has no balance.")
      }
      setIsProcessing(false)
    }, 1500)
  }

  const handlePayment = async () => {
    setError("")
    setIsProcessing(true)

    try {
      switch (selectedMethod) {
        case PAYMENT_METHODS.CARD:
          // Initiate Flutterwave card payment
          if (typeof window.FlutterwaveCheckout !== "undefined") {
            window.FlutterwaveCheckout({
              public_key: "FLWPUBK_TEST-YOUR_PUBLIC_KEY",
              tx_ref: `PB-${Date.now()}`,
              amount,
              currency: "USD",
              payment_options: "card",
              customer: {
                email: customerInfo.email,
                phone_number: customerInfo.phone,
                name: `${customerInfo.firstName} ${customerInfo.lastName}`,
              },
              customizations: {
                title: "Pallet Bodega",
                description: "Payment for your order",
                logo: "https://www.palletbodega.com/logo.png",
              },
              callback: (response) => {
                if (response.status === "successful") {
                  onSuccess(response.transaction_id)
                } else {
                  setError("Payment failed. Please try again.")
                }
                setIsProcessing(false)
              },
              onclose: () => {
                setIsProcessing(false)
              },
            })
          } else {
            // Fallback for demo/development
            simulatePayment()
          }
          break

        case PAYMENT_METHODS.BANK_TRANSFER:
          // Generate bank transfer details
          setPaymentInfo({
            accountName: "Pallet Bodega LLC",
            accountNumber: "0123456789",
            bankName: "Demo Bank",
            reference: `PB-${Date.now().toString().slice(-8)}`,
            amount,
          })
          setIsProcessing(false)
          break

        case PAYMENT_METHODS.NIGERIA:
        case PAYMENT_METHODS.UK_EU:
        case PAYMENT_METHODS.ACH:
          // For demo, simulate these payment methods
          simulatePayment()
          break

        case PAYMENT_METHODS.GIFT_CARD:
          // Gift card validation is handled separately
          if (!paymentInfo) {
            setError("Please verify your gift card first.")
            setIsProcessing(false)
          } else {
            // Process gift card payment
            setTimeout(() => {
              onSuccess(`GC-${Date.now()}`)
              setIsProcessing(false)
            }, 1000)
          }
          break

        default:
          setError("Please select a payment method.")
          setIsProcessing(false)
      }
    } catch (error) {
      console.error("Payment error:", error)
      setError("An error occurred while processing your payment. Please try again.")
      setIsProcessing(false)
    }
  }

  // Simulate payment for demo purposes
  const simulatePayment = () => {
    setTimeout(() => {
      // 90% success rate for demo
      if (Math.random() < 0.9) {
        onSuccess(`DEMO-${Date.now()}`)
      } else {
        setError("Payment failed. Please try again.")
      }
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="payment-gateway">
      <h2 className="section-title">Select Payment Method</h2>

      <div className="payment-methods">
        <div
          className={`payment-method ${selectedMethod === PAYMENT_METHODS.CARD ? "selected" : ""}`}
          onClick={() => handleMethodSelect(PAYMENT_METHODS.CARD)}
        >
          <div className="payment-method-icon">
            <CreditCard size={24} />
          </div>
          <div className="payment-method-name">Card Payment</div>
        </div>

        <div
          className={`payment-method ${selectedMethod === PAYMENT_METHODS.BANK_TRANSFER ? "selected" : ""}`}
          onClick={() => handleMethodSelect(PAYMENT_METHODS.BANK_TRANSFER)}
        >
          <div className="payment-method-icon">
            <Building size={24} />
          </div>
          <div className="payment-method-name">Bank Transfer</div>
        </div>

        <div
          className={`payment-method ${selectedMethod === PAYMENT_METHODS.NIGERIA ? "selected" : ""}`}
          onClick={() => handleMethodSelect(PAYMENT_METHODS.NIGERIA)}
        >
          <div className="payment-method-icon">
            <Globe size={24} />
          </div>
          <div className="payment-method-name">Nigeria Payment</div>
        </div>

        <div
          className={`payment-method ${selectedMethod === PAYMENT_METHODS.UK_EU ? "selected" : ""}`}
          onClick={() => handleMethodSelect(PAYMENT_METHODS.UK_EU)}
        >
          <div className="payment-method-icon">
            <Euro size={24} />
          </div>
          <div className="payment-method-name">UK/EU Payment</div>
        </div>

        <div
          className={`payment-method ${selectedMethod === PAYMENT_METHODS.ACH ? "selected" : ""}`}
          onClick={() => handleMethodSelect(PAYMENT_METHODS.ACH)}
        >
          <div className="payment-method-icon">
            <DollarSign size={24} />
          </div>
          <div className="payment-method-name">ACH Transfer</div>
        </div>

        <div
          className={`payment-method ${selectedMethod === PAYMENT_METHODS.GIFT_CARD ? "selected" : ""}`}
          onClick={() => handleMethodSelect(PAYMENT_METHODS.GIFT_CARD)}
        >
          <div className="payment-method-icon">
            <Gift size={24} />
          </div>
          <div className="payment-method-name">Gift Card</div>
        </div>
      </div>

      {selectedMethod && (
        <div className="payment-details">
          {selectedMethod === PAYMENT_METHODS.CARD && (
            <div className="card-payment-form">
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  name="number"
                  className="form-input"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={handleCardInputChange}
                  maxLength={19}
                />
              </div>

              <div className="card-details">
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    className="form-input"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={handleCardInputChange}
                    maxLength={5}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    className="form-input"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleCardInputChange}
                    maxLength={4}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cardholder Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={handleCardInputChange}
                />
              </div>
            </div>
          )}

          {selectedMethod === PAYMENT_METHODS.BANK_TRANSFER && (
            <div className="bank-transfer-form">
              {paymentInfo ? (
                <div className="bank-details">
                  <h3>Bank Transfer Details</h3>
                  <p>
                    <span>Account Name:</span>
                    <span>
                      {paymentInfo.accountName}
                      <button className="copy-button" onClick={() => copyToClipboard(paymentInfo.accountName)}>
                        {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                      </button>
                    </span>
                  </p>
                  <p>
                    <span>Account Number:</span>
                    <span>
                      {paymentInfo.accountNumber}
                      <button className="copy-button" onClick={() => copyToClipboard(paymentInfo.accountNumber)}>
                        {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                      </button>
                    </span>
                  </p>
                  <p>
                    <span>Bank Name:</span>
                    <span>{paymentInfo.bankName}</span>
                  </p>
                  <p>
                    <span>Reference:</span>
                    <span>
                      {paymentInfo.reference}
                      <button className="copy-button" onClick={() => copyToClipboard(paymentInfo.reference)}>
                        {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                      </button>
                    </span>
                  </p>
                  <p>
                    <span>Amount:</span>
                    <span>${paymentInfo.amount.toFixed(2)}</span>
                  </p>

                  <div className="payment-info">
                    <p>Please make a transfer to the account details above with the exact reference code.</p>
                    <p>After making the transfer, click "I Have Paid" to confirm your payment.</p>
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <p>Click "Generate Bank Details" to receive bank transfer information.</p>
                </div>
              )}
            </div>
          )}

          {selectedMethod === PAYMENT_METHODS.NIGERIA && (
            <div className="nigeria-payment-form">
              <div className="payment-info">
                <p>You'll be redirected to complete your payment using Nigerian payment methods including:</p>
                <ul>
                  <li>Bank transfers</li>
                  <li>USSD</li>
                  <li>Local cards</li>
                </ul>
                <p>Click "Pay Now" to proceed.</p>
              </div>
            </div>
          )}

          {selectedMethod === PAYMENT_METHODS.UK_EU && (
            <div className="uk-eu-payment-form">
              <div className="payment-info">
                <p>You'll be redirected to complete your payment using UK/EU payment methods including:</p>
                <ul>
                  <li>SEPA transfers</li>
                  <li>IBAN payments</li>
                  <li>Local bank transfers</li>
                </ul>
                <p>Click "Pay Now" to proceed.</p>
              </div>
            </div>
          )}

          {selectedMethod === PAYMENT_METHODS.ACH && (
            <div className="ach-payment-form">
              <div className="payment-info">
                <p>You'll be redirected to complete your ACH payment securely.</p>
                <p>This method allows you to pay directly from your US bank account.</p>
                <p>Click "Pay Now" to proceed.</p>
              </div>
            </div>
          )}

          {selectedMethod === PAYMENT_METHODS.GIFT_CARD && (
            <div className="gift-card-form">
              <div className="form-group">
                <label className="form-label">Gift Card Code</label>
                <input
                  type="text"
                  className="gift-card-input"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  value={giftCardCode}
                  onChange={handleGiftCardChange}
                />
                <p className="form-hint">For demo, use code: DEMO1234</p>
              </div>

              <button className="verify-button" onClick={verifyGiftCard} disabled={isProcessing || !giftCardCode}>
                {isProcessing ? "Verifying..." : "Verify Gift Card"}
              </button>

              {paymentInfo && (
                <div className="payment-info">
                  <p>{paymentInfo.message}</p>
                  {paymentInfo.amount < amount && (
                    <p>
                      <strong>Note:</strong> Gift card value (${paymentInfo.amount.toFixed(2)}) is less than order total
                      (${amount.toFixed(2)}). You'll need to pay the remaining $
                      {(amount - paymentInfo.amount).toFixed(2)} using another payment method.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {error && <div className="payment-error">{error}</div>}

          <div className="payment-actions">
            <button
              className="pay-button"
              onClick={handlePayment}
              disabled={isProcessing || (selectedMethod === PAYMENT_METHODS.GIFT_CARD && !paymentInfo)}
            >
              {isProcessing
                ? "Processing..."
                : selectedMethod === PAYMENT_METHODS.BANK_TRANSFER && !paymentInfo
                  ? "Generate Bank Details"
                  : "Pay Now"}
            </button>

            <button className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="payment-powered-by">
        Powered by
        <img src="https://flutterwave.com/images/logo/full-color/flutterwave-logo.svg" alt="Flutterwave" />
      </div>
    </div>
  )
}

export default PaymentGateway

