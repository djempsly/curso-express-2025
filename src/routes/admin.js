const {Router} = require('express');
const { createTimeBlock, listReservation } = require('../controllers/adminController')
const authenticateToken = require('../midleWares/auth')

const router = Router();

router.post('/time-blocks', authenticateToken, createTimeBlock)
router.get('/reservations', authenticateToken, listReservation)




module.exports = router
