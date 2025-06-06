const fetch = require("node-fetch");

const createPayment = async (req, res) => {
  try {
    const requestData = req.body; // קבלת הנתונים מה-Frontend

    const response = await fetch(
      "https://icredit.rivhit.co.il/API/PaymentPageRequest.svc/GetUrl",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    const data = await response.json();

    if (data.Status === 0 && data.URL) {
      res.json({
        success: true,
        paymentUrl: data.URL,
        salePrivateToken: data.PrivateSaleToken, // ✅ חשוב!
      });
    } else {
      res.status(400).json({
        success: false,
        error: "שגיאה בקבלת URL לתשלום",
        details: data,
      });
    }
  } catch (error) {
    console.error("❌ שגיאה ביצירת התשלום:", error);
    res
      .status(500)
      .json({ success: false, error: "שגיאה בשרת", details: error.message });
  }
};
const verifyPayment = async (req, res) => {
  try {
    const response = await fetch(
      "https://testicredit.rivhit.co.il/API/PaymentPageRequest.svc/Verify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};
const getSaleDetails = async (req, res) => {
  try {
    const response = await fetch(
      "https://icredit.rivhit.co.il/API/PaymentPageRequest.svc/SaleDetails",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("❌ Error retrieving SaleDetails:", error);
    res.status(500).json({ error: "Failed to retrieve SaleDetails" });
  }
};

module.exports = { createPayment, verifyPayment, getSaleDetails };
