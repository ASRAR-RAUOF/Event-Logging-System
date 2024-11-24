
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventControllers');
const validateEvent = require('../middlewares/validateEvent');

router.post('/', validateEvent, eventController.createEvent);
router.get('/', eventController.queryEvents);
router.get('/verify', eventController.verifyChain);

module.exports = router;