const { Router} = require('express')

const { register, login} = require('../controllers/authController')

const authenticateToken = require('../midleWares/auth')
const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/protected-route', authenticateToken, (req, res)=>{
    res.send('Ruta proegida no se puede acceder')
});


module.exports = router;