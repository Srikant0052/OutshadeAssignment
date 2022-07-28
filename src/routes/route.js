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
router.post('/event', authorization, eventController.createEvent);
router.get('/users/:userId/invite', authorization, eventController.invite);
router.get('/users/:userId/list', authorization, eventController.list);
router.put('/users/:eventId/update', authorization, eventController.updateEvent);



module.exports = router;