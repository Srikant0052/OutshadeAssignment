const express = require('express');
const router = express.Router();
const userControoler = require('../controller/userController');
const eventController = require('../controller/eventController')
const { authorization } = require('../middleware/auth');

//User Api's
router.post('/users', userControoler.userRegistration);
router.post('/login', userControoler.userLogin);
router.get('/logout', userControoler.userLogout);
router.put('/:userId/changePassword', authorization, userControoler.changePassword);
router.put('/updatePassword', userControoler.updatePassword);
router.post('/resetPassword', userControoler.resetPassword);

//Event Api's
router.post('/event', eventController.createEvent);
router.get('/users/:userId/invite', eventController.invite);


module.exports = router;