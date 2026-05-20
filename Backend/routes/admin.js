const express = require("express");
const router = express.Router();
const {
  newEvent,
  postedEvents,
  deleteEvent,
  createProfile,
  getProfile,
  updateProfile,
  editEvent,
  getEvent,
  getEventAndUsers,
  markEventAsHosted,
  getEventSubmissions,
  getTotalEventAndUsers,
  getEventParticipants,
  getTeamDetails
} = require("../controllers/admin");

const { authenticateAdmin } = require("../middleware/authMiddleware");
const upload = require("../config/multerConfig");

router.post("/newevent", authenticateAdmin, upload.single("image"), newEvent);
router.get("/postedevents", postedEvents);
router.delete("/delete/:id", authenticateAdmin, deleteEvent);
router.patch("/eventedit/:id", authenticateAdmin, editEvent);
router.get("/event/:id", getEvent);
router.post("/createProfile", upload.single("profileImage"), createProfile);
router.get("/profile/:userId", getProfile);
router.patch("/profile/:userId", upload.single("profileImage"), updateProfile);
router.get("/event-users/:eventId", getEventAndUsers);
router.patch("/events/:eventId/host", authenticateAdmin, markEventAsHosted);
router.get("/geteventssubmission/:eventId", authenticateAdmin, getEventSubmissions);
router.get("/gettotalusersandevents", getTotalEventAndUsers);
router.get("/event-participants/:eventId", authenticateAdmin, getEventParticipants);
router.get("/team-details/:teamDataId", authenticateAdmin, getTeamDetails);

module.exports = router;
