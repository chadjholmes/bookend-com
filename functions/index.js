/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { logger } = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

admin.initializeApp();

// Configure email transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chadjayholmes@gmail.com",
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Cloud Function to check for new emails
exports.sendWelcomeEmail = onDocumentCreated({
  document: "betaSignups/{docId}",
  region: "us-central1",
  secrets: ["GMAIL_PASSWORD"]
}, async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.log("No data associated with the event");
    return;
  }

  const email = snapshot.data().email;
  if (!email) {
    logger.error("No email found in the document");
    return;
  }

  await sendEmail(email);
});

// Function to send email
const sendEmail = (email) => {
  const mailOptions = {
    from: "chadjayholmes@gmail.com",
    to: email,
    subject: "Bookends Beta Signup Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h1>Welcome to Bookends Beta!</h1>
        <p>Thank you for signing up for our beta program.</p>
        <p>We'll keep you updated on our progress.</p>
        <p>Join our community on Discord to stay connected and get the latest updates:</p>
        <p><a href="https://discord.gg/xVBdZahz6P" 
              style="background-color: #5865F2; color: white; padding: 10px 20px; 
                     text-decoration: none; border-radius: 5px; display: inline-block;">
           Join our Discord Server
        </a></p>
      </div>
    `,
    text: "Thank you for signing up for the Bookend Beta program. " +
          "We'll keep you updated on our progress. " +
          "Join our Discord community at: https://discord.gg/xVBdZahz6P",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return logger.error("Error sending email:", error);
    }
    logger.log("Email sent:", info.response);
  });
};
