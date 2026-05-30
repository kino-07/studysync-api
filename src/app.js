const express = require('express');
const app = express();

app.use(express.json());

// Rutas
const gruposRoutes = require('./routes/gruposRoutes');
app.use('/api/grupos', gruposRoutes);

// Ruta raíz para verificar que la API vive
app.get('/', (req, res) => {
  res.json({ mensaje: 'StudySync API funcionando ✅', version: '1.0.0' });
});

// Middleware de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
});

module.exports = app;