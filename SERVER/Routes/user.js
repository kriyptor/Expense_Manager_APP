const express = require(`express`);
const userController = require(`../Controllers/user`);
const { authenticate } = require(`../middleware/auth`);
const router = express.Router();


router.post('/sign-in', userController.loginUser);

router.post('/sign-up', userController.createUser);

router.get('/premium-user', authenticate, userController.checkPremiumUser);

module.exports = router;