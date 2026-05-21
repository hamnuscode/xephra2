// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const path = require("path");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const rankingRoutes = require('./routes/rankingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notification');
const upload = require("./config/multerConfig");
const cookieParser = require("cookie-parser");
const socketSetup = require("./Socket/index"); 
const startSubscriptionCron = require('./utils/subscriptionCron');
const NotificationSchedulerService = require('./services/notificationScheduler');

const passport = require('./config/passport');
const app = express();
const port = process.env.PORT || 5000;

const server = http.createServer(app);

// Start cron jobs
startSubscriptionCron();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

app.options("*", (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});


// Middleware
app.use(cookieParser());
app.use(express.json());



app.use(passport.initialize());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));



// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use('/rank', rankingRoutes);
app.use("/payments", paymentRoutes);
app.use("/notifications", notificationRoutes);

// Connect to MongoDB
connectDB();

// Sample route
app.get("/", (req, res) => {
  res.send("Game Events API");
});

// Setup Socket.io and get the io instance
const io = socketSetup(server);

// Initialize notification scheduler with the notification service
const notificationScheduler = new NotificationSchedulerService(io.notificationService);

// Make io instance globally available for other modules
global.io = io;

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
