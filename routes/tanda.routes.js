const express = require('express');
const router = express.Router();
const {
  crearTanda,
  consultarTanda,
  registrarAporte,
  resumenFinal,
  eliminarTanda,
} = require('../controllers/tanda.controller');

router.post('/', crearTanda);
router.get('/', consultarTanda);
router.post('/aporte', registrarAporte);
router.get('/resumen', resumenFinal);
router.delete('/', eliminarTanda);

module.exports = router;
