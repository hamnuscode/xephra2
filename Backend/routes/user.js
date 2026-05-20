const express = require("express");
const router = express.Router();
const {
  createProfile,
  getProfile,
  updateProfile,
  getUsers,
  deleteUser,
  suspendUser,
  getUser,
  upcomingEvents,
  joinEvent,
  getTeamData,
  updateTeamData,
  getEvents,
  getHostedEvents,
  getProfileExisting,
  getUserChatGroups,
  getMessages,
  getOlderMessages,
  getAdminUserChatGroups,
  getSingleMessages,
  getAdminUserSingleChats,
  getGroupsForAdmin,
  postuploadedfileinchat,
  getuserBadge,
  saveTeamData
} = require("../controllers/user");
const upload = require("../config/multerConfig");

router.post("/createProfile", upload.single("profileImage"), createProfile);
router.get("/profile/:userId", getProfile);
router.patch("/profile/:userId", upload.single("profileImage"), updateProfile);
router.get('/user-badge/:userId', getuserBadge);
router.get("/getusers", getUsers);
router.get("/user/:userId", getUser);
router.delete("/user/:userId", deleteUser);
router.patch("/usersuspend/:userId", suspendUser);
router.get("/upcomingevents", upcomingEvents);

router.post("/event-join", joinEvent);
router.post("/save-team-data", saveTeamData);
router.get("/team-data/:userId/:eventId", getTeamData);
router.put("/team-data/:teamDataId", updateTeamData);
router.get("/user-chat-groups", getUserChatGroups);

router.post("/registered-events", getEvents);
router.get("/events/hosted", getHostedEvents);
router.get('/profile-exit/:userId', getProfileExisting);

router.get("/messages/:chatGroupId", getMessages);
router.get("/getOlderMessages/:chatGroupId", getOlderMessages); 
router.get("/AdminUserChatgroup", getAdminUserChatGroups);
router.get('/single-chat/:chatGroupId', getSingleMessages);
router.get('/single-allchats/:adminId', getAdminUserSingleChats);
router.get('/admin-chatgroups/:adminId', getGroupsForAdmin);
router.post('/uplaod-file-chat', upload.single("fileUpload") ,postuploadedfileinchat);
module.exports = router;
