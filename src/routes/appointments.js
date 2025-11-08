const { Router } = require('express');
const router = Router();
const appointmentsController = require('../controllers/appointmentsController')
const authenticateToken = require('../midleWares/auth')

router.get('/:id/appointments', authenticateToken, appointmentsController.getUserAppointments)

module.exports = router