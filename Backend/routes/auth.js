const express = require("express");
const router = express.Router();
const { signup, Login, forgot, reset, verifyEmail, resendVerificationEmail  } = require("../controllers/auth");
const passport = require("passport");

router.post("/signup", signup);
router.post("/login", Login);
router.post("/forgot", forgot);
router.post("/reset/:token", reset);

const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.CALLBACKURL
);

if (googleEnabled) {
  router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    (req, res) => {
      const { user, token } = req.user;
      const userData = {
        name: user.name,
        UserId: user.userId,
        email: user.email,
        role: user.role,
        token: token,
      };
      const frontend = (process.env.FRONTEND_URL || "http://localhost:3000").split(",")[0].trim();
      res.redirect(`${frontend}/google-success?data=${encodeURIComponent(JSON.stringify(userData))}`);
    }
  );
} else {
  const disabledHandler = (req, res) =>
    res.status(503).json({ message: "Google OAuth is not configured on this server" });
  router.get("/google", disabledHandler);
  router.get("/google/callback", disabledHandler);
}


// New email verification routes
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);  
  
module.exports = router;
