const nodemailer = require("nodemailer");

const sendOrderConfirmationEmail = async (req, res) => {
  const { toEmail, orderData } = req.body;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const vatRate = 0.18;
  const totalBeforeVAT = orderData.totalPrice / (1 + vatRate);
  const vatAmount = orderData.totalPrice - totalBeforeVAT;

  const shippingAddressText = `
כתובת למשלוח:
עיר: ${orderData.shippingAddress?.city || "לא צויין"}
רחוב: ${orderData.shippingAddress?.street || "לא צויין"}
דירה: ${orderData.shippingAddress?.apartment || "לא צויין"}
קומה: ${orderData.shippingAddress?.floor || "לא צויין"}
כניסה: ${orderData.shippingAddress?.entrance || "לא צויין"}
`;

  const shippingAddressHTML = `
<h3 style="margin-top: 20px;">כתובת למשלוח:</h3>
<ul style="list-style: none; padding: 0;">
  <li>עיר: ${orderData.shippingAddress?.city || "לא צויין"}</li>
  <li>רחוב: ${orderData.shippingAddress?.street || "לא צויין"}</li>
  <li>דירה: ${orderData.shippingAddress?.apartment || "לא צויין"}</li>
  <li>קומה: ${orderData.shippingAddress?.floor || "לא צויין"}</li>
  <li>כניסה: ${orderData.shippingAddress?.entrance || "לא צויין"}</li>
</ul>
`;

  // מייל ללקוח
  const customerMailOptions = {
    from: `"Lavan Group" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `אישור הזמנה - מספר ${orderData.purchaseId}`,
    text: `
תודה על ההזמנה שלך!

מספר הזמנה: ${orderData.purchaseId}

פרטי המוצרים:
${orderData.cartItems
  .map(
    (item) =>
      `${item.baseName || item.name} - ${
        item.quantity
      } יחידות - ₪${item.unitPrice.toFixed(2)} ליחידה - סה"כ ₪${(
        item.unitPrice * item.quantity
      ).toFixed(2)}` + (item.comment ? ` | הערה: ${item.comment}` : "")
  )
  .join("\n")}

${orderData.shippingCost > 0 ? `משלוח: ₪${orderData.shippingCost}` : ""}
${
  orderData.craneUnloadCost > 0
    ? `פריקת מנוף: ₪${orderData.craneUnloadCost}`
    : ""
}

${shippingAddressText}

סה"כ ללא מע"מ: ₪${totalBeforeVAT.toFixed(2)}
מע"מ (18%): ₪${vatAmount.toFixed(2)}
סה"כ לתשלום: ₪${orderData.totalPrice.toFixed(2)}

נשמח לשרת אותך שוב!
📞 050-5342813 | Lavan1414@gmail.com
        `,
    html: `
<div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; color: #333;">
  <h1 style="color: #2e7d32;">תודה על ההזמנה שלך!</h1>
  <p><strong>מספר הזמנה:</strong> ${orderData.purchaseId}</p>

  <h3 style="margin-top: 20px;">פרטי המוצרים:</h3>
  <ul style="list-style: none; padding: 0;">
    ${orderData.cartItems
      .map(
        (item) => `
      <li style="margin-bottom: 10px;">
        ${item.baseName || item.name} - ${
          item.quantity
        } יחידות - ₪${item.unitPrice.toFixed(2)} ליחידה -
        <strong>סה"כ ₪${(item.unitPrice * item.quantity).toFixed(2)}</strong>
        ${
          item.comment
            ? `<br><span style="color: #555;"><em>הערה: ${item.comment}</em></span>`
            : ""
        }
      </li>
    `
      )
      .join("")}
  </ul>

  ${
    orderData.shippingCost > 0
      ? `<p><strong>משלוח:</strong> ₪${orderData.shippingCost}</p>`
      : ""
  }
  ${
    orderData.craneUnloadCost > 0
      ? `<p><strong>פריקת מנוף:</strong> ₪${orderData.craneUnloadCost}</p>`
      : ""
  }

  ${shippingAddressHTML}

  <div style="margin-top: 30px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
    <p><strong>סה"כ ללא מע"מ:</strong> ₪${totalBeforeVAT.toFixed(2)}</p>
    <p><strong>מע"מ (18%):</strong> ₪${vatAmount.toFixed(2)}</p>
    <p style="color: #d32f2f; font-weight: bold;">סה"כ לתשלום: ₪${orderData.totalPrice.toFixed(
      2
    )}</p>
  </div>

  <hr style="margin: 20px 0;" />
  <p style="color: #555;">📞 <strong>050-5342813</strong> | <a href="mailto:Lavan1414@gmail.com">Lavan1414@gmail.com</a></p>
</div>
        `,
    replyTo: process.env.GMAIL_USER,
  };

  // מייל לעצמך
  const adminMailOptions = {
    from: `"Lavan Group" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `📢 התקבלה הזמנה חדשה - מספר ${orderData.purchaseId}`,
    text: customerMailOptions.text.replace(
      "תודה על ההזמנה שלך!",
      "📢 התקבלה הזמנה חדשה!"
    ),
    html: customerMailOptions.html
      .replace("תודה על ההזמנה שלך!", "📢 התקבלה הזמנה חדשה!")
      .replace("#2e7d32", "#d32f2f"),
  };

  try {
    await transporter.sendMail(customerMailOptions);
    await transporter.sendMail(adminMailOptions);
    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to send email.", details: error.message });
  }
};

module.exports = { sendOrderConfirmationEmail };
