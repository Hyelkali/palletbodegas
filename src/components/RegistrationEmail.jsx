import "./EmailTemplates.css"

const RegistrationEmail = ({ customerName = "Valued Customer", customerEmail = "customer@example.com" }) => {
  return (
    <div className="email-template">
      <div className="email-container">
        <div className="email-header">
          <img src="/logo.png" alt="PalletBodega Logo" className="email-logo" />
        </div>

        <div className="email-body">
          <h1>Welcome to PalletBodega!</h1>
          <p>Hello {customerName},</p>
          <p>
            Thank you for registering with PalletBodega. Your account has been successfully created with the email
            address: <strong>{customerEmail}</strong>
          </p>

          <div className="email-benefits">
            <h2>Your account benefits:</h2>
            <ul>
              <li>Access to exclusive deals and promotions</li>
              <li>Easy order tracking and history</li>
              <li>Faster checkout process</li>
              <li>Customer support chat</li>
            </ul>
          </div>

          <div className="email-cta">
            <a href="/catalog" className="email-button">
              Start Shopping Now
            </a>
          </div>

          <p>
            If you have any questions or need assistance, please don't hesitate to contact our customer support team.
          </p>
          <p>Happy shopping!</p>
          <p>The PalletBodega Team</p>
        </div>

        <div className="email-footer">
          <p>&copy; {new Date().getFullYear()} PalletBodega. All rights reserved.</p>
          <div className="email-social">
            <a href="#" className="social-link">
              Facebook
            </a>
            <a href="#" className="social-link">
              Instagram
            </a>
            <a href="#" className="social-link">
              Twitter
            </a>
          </div>
          <p className="email-unsubscribe">
            You're receiving this email because you signed up for PalletBodega.
            <br />
            <a href="#">Unsubscribe</a> or <a href="#">manage your email preferences</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegistrationEmail

