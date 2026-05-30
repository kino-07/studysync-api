const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StudySync API',
      version: '1.0.0',
      description: 'API REST para gestión de grupos de estudio — Programación IV, UPDS 2026',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local' },
      { url: 'https://studysync-api-prv0.onrender.com', description: 'Producción' }
    ],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);