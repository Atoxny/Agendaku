require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Servir interfaz de usuario
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/api/tanda', require('./routes/tanda.routes'));

// Info de la API
app.get('/api', (req, res) => {
  res.json({
    message: 'Agendaku API is running 🚀',
    version: '1.0.0',
    endpoints: {
      'POST /api/tanda': 'Crear nueva tanda',
      'GET /api/tanda': 'Consultar tanda activa',
      'POST /api/tanda/aporte': 'Registrar aporte de participante',
      'GET /api/tanda/resumen': 'Ver resumen final del ciclo',
      'DELETE /api/tanda': 'Eliminar tanda activa',
    },
  });
});

app.listen(PORT, () => {
  console.log(`✅ Agendaku server running on http://localhost:${PORT}`);
});
