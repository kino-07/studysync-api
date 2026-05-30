// ============================================================
// SERVER-SOCKETIO.JS — Puente Redis → Navegador via Socket.io
// Ejecutar en Terminal 3: node pubsub/server-socketio.js
// ============================================================
require('dotenv').config();
const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const Redis      = require('ioredis');
const path       = require('path');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*' }
});

// Conexión Redis separada para suscribirse
const sub = new Redis(process.env.REDIS_URL);

// Servir archivos públicos
app.use(express.static(path.join(__dirname, '../public')));

// Ruta de la página de notificaciones
app.get('/notificaciones', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/notificaciones.html'));
});

// Ruta de estado de la API
app.get('/estado', (req, res) => {
  res.json({
    ok:      true,
    mensaje: 'Socket.io server activo',
    canales: ['study:sesion:creada', 'study:usuario:unido', 'study:material:publicado']
  });
});

// ── Socket.io: manejar clientes del navegador ─────────────
io.on('connection', (socket) => {
  console.log(`🌐 Navegador conectado: ${socket.id}`);

  // Enviar mensaje de bienvenida al cliente
  socket.emit('bienvenida', {
    mensaje:  'Conectado al sistema de notificaciones StudySync',
    canales:  ['study:sesion:creada', 'study:usuario:unido', 'study:material:publicado'],
    servidor: 'Socket.io + Redis Pub/Sub'
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Navegador desconectado: ${socket.id}`);
  });
});

// ── Redis: suscribirse y reenviar al navegador ────────────
sub.on('connect', () => {
  console.log('✅ Socket.io server conectado a Upstash Redis');
  sub.psubscribe('study:*', (err) => {
    if (err) console.error('❌ Error al suscribirse:', err.message);
    else console.log('👂 Escuchando canales study:*');
  });
});

sub.on('pmessage', (patron, canal, mensajeRaw) => {
  try {
    const mensaje = JSON.parse(mensajeRaw);

    // Reenviar a todos los clientes del navegador
    io.emit('notificacion', {
      canal,
      tipo:      mensaje.tipo,
      payload:   mensaje.payload,
      timestamp: mensaje.timestamp,
      version:   mensaje.version
    });

    console.log(`📡 Reenviado al navegador: [${canal}] ${mensaje.tipo}`);
  } catch (err) {
    console.error('❌ Error al procesar mensaje:', err.message);
  }
});

sub.on('error', (err) => {
  console.error('❌ Error Redis:', err.message);
});

// ── Iniciar servidor ──────────────────────────────────────
const PORT = process.env.PORT_SOCKET || 3001;
server.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   StudySync — Socket.io + Redis          ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
  console.log(`🌐 Notificaciones: http://localhost:${PORT}/notificaciones`);
  console.log('');
});
