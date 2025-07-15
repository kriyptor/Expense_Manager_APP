const express = require(`express`);
const paymentController = require(`../Controllers/payment`);
const { authenticate } = require(`../middleware/auth`);

const router = express.Router();


router.post('/session',  authenticate,  paymentController.createOrder);

router.post('/verify',  authenticate,  paymentController.verifyPayment);


module.exports = router;