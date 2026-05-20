const express = require("express");
const router = express.Router();
const {postRankingApproval, getUserSubmissions, userApprovalDelete , assignEventRanking, declineRanking , getRegisteredUsersAndRankings , getAllUsersRanking , getTopRanking, getUserRank} = require('../controllers/ranking');
const upload = require('../config/multerConfig');

router.post('/approval',upload.single('screenshot'),  postRankingApproval);
router.get('/submissions/:userId', getUserSubmissions);
router.delete('/approvaldelete', userApprovalDelete );
router.post('/assign-rank', assignEventRanking);
router.post('/decline-submission', declineRanking);
router.get('/gettopranks', getTopRanking);
router.get('/event/:eventId/participants', getRegisteredUsersAndRankings);
router.get('/allusers-ranking', getAllUsersRanking);
router.get('/user-rank', getUserRank);

module.exports = router;