// middleware/validatePayment.js

exports.validatePayment = (req, res, next) => {
  const { name, email, phone, transactionId, selectedPlan, paymentMethod } = req.body;

  if (!name || !email || !phone || !selectedPlan || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: "Name, email, phone, selectedPlan, and paymentMethod are required fields.",
    });
  }

  const validPlans = ["weekly", "monthly", "quarterly"];
  if (!validPlans.includes(selectedPlan)) {
    return res.status(400).json({
      success: false,
      message: "Invalid subscription plan selected.",
    });
  }

  const validMethods = ["hbl", "ubl", "mcb", "jazzcash", "easypaisa"];
  if (!validMethods.includes(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment method.",
    });
  }

  // Optional: validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format.",
    });
  }

  // Optional: validate phone number format
  const phoneRegex = /^03[0-9]{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Phone number must be a valid Pakistani number starting with 03.",
    });
  }

  next();
};
