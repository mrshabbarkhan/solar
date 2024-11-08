const express = require('express');

const { storeEnergyData, getDailyData, getWeeklyData} = require('../controllers/solarControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Protected routes (requires valid JWT)
router.post('/', protect, storeEnergyData);
router.get('/daily',protect,getDailyData);
router.get('/weekly',protect,getWeeklyData);



module.exports = router;
