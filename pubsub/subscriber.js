require('dotenv').config();
const Redis = require('ioredis');

const sub = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});

let totalRecibidos = 0;

sub.on('connect', () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   StudySync — Suscriptor Redis Pub/Sub   ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('✅ Conectado a Upstash Redis');
  console.log('👂 Escuchando canales study:*...');
  console.log('');
});

sub.on('ready', () => {
  sub.psubscribe('study:*', (err, count) => {
    if (err) {
      console.error('❌ Error al suscribirse:', err.message);
    } else {
      console.log(`📡 Suscrito a ${count} patrón(es)`);
      console.log('════════════════════════════════════════');
      console.log('   Esperando mensajes...');
      console.log('════════════════════════════════════════');
      console.log('');
    }
  });
});

sub.on('error', (err) => {
  if (!err.message.includes('subscriber mode')) {
    console.error('❌ Error:', err.message);
  }
});

sub.on('pmessage', (patron, canal, mensajeRaw) => {
  try {
    const mensaje = JSON.parse(mensajeRaw);
    totalRecibidos++;
    const hora = new Date(mensaje.timestamp).toLocaleTimeString('es-BO');

    console.log(`┌─ Mensaje #${totalRecibidos} ──────────────────────────`);
    console.log(`│  Hora:  ${hora}`);
    console.log(`│  Canal: ${canal}`);
    console.log(`│  Tipo:  ${mensaje.tipo}`);
    console.log('│');

    switch (mensaje.tipo) {
      case 'SESION_CREADA':
        const s = mensaje.payload;
        console.log(`│  📚 Nueva sesión: ${s.tema}`);
        console.log(`│     Fecha: ${s.fecha} | Lugar: ${s.lugar}`);
        console.log(`│     Creado por: ${s.creadoPor}`);
        console.log(`│  📧 Notificando a miembros del grupo...`);
        break;

      case 'USUARIO_UNIDO':
        const u = mensaje.payload;
        console.log(`│  🙋 ${u.nombre} se unió a ${u.nombreGrupo}`);
        console.log(`│  📧 Notificando al organizador...`);
        break;

      case 'MATERIAL_PUBLICADO':
        const m = mensaje.payload;
        console.log(`│  📄 Nuevo material: "${m.titulo}"`);
        console.log(`│     Materia: ${m.materia} | Autor: ${m.autor}`);
        console.log(`│  📧 Notificando a suscriptores...`);
        break;

      default:
        console.log(`│  ⚠️  Tipo desconocido: ${mensaje.tipo}`);
    }

    console.log('└────────────────────────────────────────');
    console.log('');
  } catch (err) {
    console.error('❌ Error al parsear:', err.message);
  }
});

process.on('SIGINT', () => {
  console.log(`\n📊 Total recibidos: ${totalRecibidos}`);
  console.log('👋 Suscriptor detenido.');
  sub.disconnect();
  process.exit(0);
});