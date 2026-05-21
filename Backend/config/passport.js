const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/User");

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.CALLBACKURL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACKURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            user = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: null,
            });
            await user.save();
          }

          const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
          return done(null, { user, token });
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.log("[passport] Google OAuth disabled (GOOGLE_CLIENT_ID/SECRET/CALLBACKURL not set)");
}

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
