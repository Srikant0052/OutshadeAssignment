const express = require('express');
const router = express.Router();
const userControoler = require('../controller/userController');

//User Api's
router.post('/users',  userControoler.userRegistration);
router.post('/login', userControoler.userLogin);
router.get('/logout', userControoler.userLogout);
router.put('/:userId/changePassword', userControoler.changePassword);


module.exports = router;