const { loginController, registerController } = require('../controllers/user');

const router = require('express').Router();

router.post('/login', loginController);


router.post('/register', registerController);

module.exports = router;