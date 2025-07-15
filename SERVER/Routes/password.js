const express = require(`express`);
const passwordController = require(`../Controllers/password`);
const router = express.Router();


router.post('/forgot-password', passwordController.forgotPassword);

router.get('/reset-password-link', passwordController.resetPasswordGet);

router.post('/reset-password', passwordController.resetPasswordPost);


module.exports = router;