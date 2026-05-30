const express      = require('express');
const path         = require('path');
const swaggerUi    = require('swagger-ui-express');   // ← agregar
const swaggerSpec  = require('./swagger');             // ← agregar
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Swagger — documentación interactiva
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // ← agregar

const grupoRoutes = require('./routes/gruposRoutes');
app.use('/api/grupos', grupoRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
});

module.exports = app;