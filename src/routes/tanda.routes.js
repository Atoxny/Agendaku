const express = require('express');
const router = express.Router();
const tandaController = require('../controllers/tanda.controller');

router.post('/', tandaController.create);
router.get('/', tandaController.getStatus);
router.post('/aporte', tandaController.addAporte);

module.exports = router;
