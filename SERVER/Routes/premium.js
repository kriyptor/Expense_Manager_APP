const express = require(`express`);
const premiumController = require(`../Controllers/premium`);
const { authenticate } = require(`../middleware/auth`);

const router = express.Router();


router.get('/leaderboard', authenticate, premiumController.getLeaderboardData);

router.post('/make-user-premium', authenticate, premiumController.makeUserPremium);


module.exports = router;