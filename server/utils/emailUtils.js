// utils/emailUtils.js

const nodemailer = require("nodemailer");

const sendOrderConfirmationEmail = async (toEmail, orderData) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Elad's Shop" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `אישור הזמנה - מספר ${orderData.purchaseId}`,
    html: `
            <h1>תודה על ההזמנה!</h1>
            <p>מספר הזמנה: ${orderData.purchaseId}</p>
            <p>סה"כ לתשלום: ₪${orderData.totalPrice.toFixed(2)}</p>
            <h3>פרטי המוצרים:</h3>
            <ul>
                ${orderData.cartItems
                  .map(
                    (item) => `
                    <li>${item.baseName || item.name} - ${
                      item.quantity
                    } יחידות - ₪${item.unitPrice}</li>
                `
                  )
                  .join("")}
            </ul>
        `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderConfirmationEmail };
