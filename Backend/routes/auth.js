const express = require("express");
const router = express.Router();
const { signup, Login, forgot, reset, verifyEmail, resendVerificationEmail  } = require("../controllers/auth");
const passport = require("passport");

router.post("/signup", signup);
router.post("/login", Login);
router.post("/forgot", forgot);
router.post("/reset/:token", reset);
router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    (req, res) => {
      const { user, token } = req.user;
  
      // Prepare user data to send to frontend
      const userData = {
        name: user.name,
        UserId: user.userId,
        email: user.email,
        role: user.role,
        token: token, // Include token for authentication
      };
  
      // Redirect to frontend with user data
      res.redirect(
        `https://xephra.net/google-success?data=${encodeURIComponent(
          JSON.stringify(userData)
        )}`
      );
    }
  );


// New email verification routes
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);  
  
module.exports = router;
