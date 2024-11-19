/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { log } = require("firebase-functions/logger");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

admin.initializeApp();

// Configure email transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chad@bookends.app",
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Cloud Function to check for new emails
exports.sendWelcomeEmail = onDocumentCreated({
  document: "betaSignups/{docId}",
  region: "us-central1",
  secrets: ["GMAIL_PASSWORD"]
}, async (event) => {
  log("Function triggered with event:", event);

  const snapshot = event.data;
  if (!snapshot) {
    log("No data associated with the event");
    return;
  }

  log("Snapshot data:", snapshot);

  const email = snapshot.data().email;
  if (!email) {
    log("No email found in the document");
    return;
  }

  log("Email found:", email);

  try {
    await sendEmail(email);
    log("Email sent successfully to:", email);
  } catch (error) {
    log("Error sending email:", error);
  }
});

// Function to send email
const sendEmail = (email) => {
  const mailOptions = {
    from: "chad@bookends.app",
    to: email,
    subject: "Bookends Beta Signup Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h1>Welcome to Bookends Beta!</h1>
        <p>Thanks for signing up! You may have noticed you received an email either from "App Store Connect" or "TestFlight" with an invite to the beta testing group.</p>
        <p>To get the Bookends beta on your phone you will need to do the following.</p>
        <ol>
          <li>Install the "TestFlight" app in the apple app store on your iOS (iPhone) device.</li>
          <li>Accept the Beta group invite in your email</li>
          <li>Return to the TestFlight app and install Bookends</li>
          <li>The Bookends app should now be installed on your phone ready to use!</li>
        </ol>
        <p>If you have any troubles at all please reach out in the discord server in the #beta channel!</p>
        <p><a href="https://discord.gg/xVBdZahz6P" 
              style="background-color: #5865F2; color: white; padding: 10px 20px; 
                     text-decoration: none; border-radius: 5px; display: inline-block;">
           Join our Discord Server
        </a></p>
        <p>And feel free to use that channel as open discussion and/or feedback as you get familiar with the app. I'll be sure to monitor it pretty regularly!</p>
      </div>
    `,
    text: 'Thanks for signing up for the Bookends beta! You may have noticed you received an email either from "App Store Connect" or "TestFlight" with an invite to the beta testing group.' +
          'To get the Bookends beta on your phone you will need to do the following.' +
          '1. Install the "TestFlight" app in the apple app store on your iOS (iPhone) device.' +
          '2. Accept the Beta group invite in your email' +
          '3. Return to the TestFlight app and install Bookends' +
          '4. The Bookends app should now be installed on your phone ready to use!' +
          'If you have any troubles at all please reach out in the discord server in the #beta channel!' +
          'https://discord.gg/xVBdZahz6P' +
          'And feel free to use that channel as open discussion and/or feedback as you get familiar with the app. I will be sure to monitor it pretty regularly!'
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        log("Error sending email:", error);
        return reject(error);
      }
      else {
        log("Email sent:", info.response);
        return resolve(info);
      }
    });
  });
};
