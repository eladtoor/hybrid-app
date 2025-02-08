const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Environment variables (set them in Firebase)
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Cloud Function to send email
exports.sendOrderConfirmation = functions.https.onCall(
  async (data, context) => {
    const { userEmail, adminEmail, purchaseId, orderDetails } = data;

    const mailOptions = {
      from: `"Your Store" <${gmailEmail}>`,
      to: [userEmail, adminEmail], // Send to both user & admin
      subject: `Order Confirmation - #${purchaseId}`,
      html: `<p>Thank you for your purchase!</p>
               <p>Order ID: <strong>${purchaseId}</strong></p>
               <p>Details: ${orderDetails}</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { success: true, message: "Email sent successfully!" };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }
  }
);
