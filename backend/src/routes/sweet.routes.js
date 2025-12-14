const express = require('express');
const router = express.Router();
const SweetController = require('../controllers/sweet.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/', verifyToken, SweetController.findAll);
router.post('/', verifyToken, isAdmin, SweetController.create);
router.post('/:id/purchase', verifyToken, SweetController.purchase);

module.exports = router;
