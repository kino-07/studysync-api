require('dotenv').config();
const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const Redis      = require('ioredis');
const path       = require('path');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

const sub = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});

app.use(express.static(path.join(__dirname, '../public')));

app.get('/notificaciones', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/notificaciones.html'));
});

io.on('connection', (socket) => {
  console.log(`🌐 Navegador conectado: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔌 Navegador desconectado: ${socket.id}`);
  });
});

sub.on('ready', () => {
  console.log('✅ Conectado a Upstash Redis');
  sub.psubscribe('study:*', (err) => {
    if (err) console.error('❌ Error:', err.message);
    else console.log('👂 Escuchando canales study:*');
  });
});

sub.on('pmessage', (patron, canal, mensajeRaw) => {
  try {
    const mensaje = JSON.parse(mensajeRaw);
    io.emit('notificacion', {
      canal,
      tipo:      mensaje.tipo,
      payload:   mensaje.payload,
      timestamp: mensaje.timestamp,
      version:   mensaje.version
    });
    console.log(`📡 Reenviado al navegador: [${canal}] ${mensaje.tipo}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
});

sub.on('error', (err) => {
  if (!err.message.includes('subscriber mode')) {
    console.error('❌ Error Redis:', err.message);
  }
});

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