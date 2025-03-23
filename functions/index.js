/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Set up nodemailer transport (example using Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hyelnamunianthan@gmail.com",  // Your email address
    pass: "pallet123"    // Your email password or app password
  }
});

// Cloud Function to handle sending email
exports.sendPasswordResetEmail = functions.auth.user().onCreate((user) => {
  const email = user.email;  // Get the user's email
  const resetLink = `https://pallet-bodega-shop.firebaseapp.com/__/auth/action?mode=action&oobCode=${user.oobCode}`;

  const mailOptions = {
    from: "hyelnamunianthan@gmail.com",
    to: email,
    subject: "Password Reset Request for %APP_NAME%",
    html: `
      <html>
        <body>
          <div style="text-align: center;">
            <img src="https://your-image-url.com/animated-avatar.gif" alt="Your %APP_NAME% Avatar" width="150" />
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>Follow this link to reset your %APP_NAME% password for your ${email} account:</p>
            <a href="${resetLink}" style="display: inline-block; background-color: #1a73e8; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none;">Reset Password</a>
            <p>If you didn’t ask to reset your password, you can ignore this email.</p>
            <p>Thanks,<br>Your %APP_NAME% team</p>
          </div>
        </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions)
    .then(() => {
      console.log('Password reset email sent to:', email);
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
