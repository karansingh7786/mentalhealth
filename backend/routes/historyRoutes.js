const express = require('express');
const router = express.Router();
const { getHistory } = require('../controllers/historyController');

router.get('/history', getHistory);

module.exports = router;
