// ============================================================
// SUBSCRIBER.JS — Escucha todos los canales study:*
// Ejecutar en Terminal 2: node pubsub/subscriber.js
// ============================================================
require('dotenv').config();
const Redis = require('ioredis');

// Conexión SEPARADA (obligatorio en modo SUBSCRIBE)
const sub = new Redis(process.env.REDIS_URL);

// Contador de mensajes recibidos
let totalRecibidos = 0;

sub.on('connect', () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   StudySync — Suscriptor Redis Pub/Sub   ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('✅ Conectado a Upstash Redis');
  console.log('👂 Suscribiéndose a canales study:*...');
  console.log('');

  // Suscribirse a todos los canales study:* con wildcard
  sub.psubscribe('study:*', (err, count) => {
    if (err) {
      console.error('❌ Error al suscribirse:', err.message);
    } else {
      console.log(`📡 Suscrito a ${count} patrón(es)`);
      console.log('   Canales escuchados:');
      console.log('   → study:sesion:creada');
      console.log('   → study:usuario:unido');
      console.log('   → study:material:publicado');
      console.log('');
      console.log('════════════════════════════════════════');
      console.log('   Esperando mensajes del publicador...');
      console.log('════════════════════════════════════════');
      console.log('');
    }
  });
});

sub.on('error', (err) => {
  console.error('❌ Error en suscriptor:', err.message);
});

// ── Listener principal — procesa cada mensaje recibido ────
sub.on('pmessage', (patron, canal, mensajeRaw) => {
  try {
    const mensaje = JSON.parse(mensajeRaw);
    totalRecibidos++;

    const hora = new Date(mensaje.timestamp).toLocaleTimeString('es-BO');

    console.log(`┌─ Mensaje #${totalRecibidos} ─────────────────────────`);
    console.log(`│  Hora:    ${hora}`);
    console.log(`│  Canal:   ${canal}`);
    console.log(`│  Tipo:    ${mensaje.tipo}`);
    console.log(`│  Versión: ${mensaje.version}`);
    console.log('│');

    // Lógica de negocio diferenciada por tipo de evento
    switch (mensaje.tipo) {

      case 'SESION_CREADA': {
        const s = mensaje.payload;
        console.log(`│  📚 NUEVA SESIÓN DE ESTUDIO`);
        console.log(`│     Tema:     ${s.tema}`);
        console.log(`│     Grupo:    #${s.grupoId}`);
        console.log(`│     Fecha:    ${s.fecha}`);
        console.log(`│     Duración: ${s.duracion} minutos`);
        console.log(`│     Lugar:    ${s.lugar}`);
        console.log(`│     Creado por: ${s.creadoPor}`);
        console.log(`│`);
        console.log(`│  📧 [EMAIL] Notificando a miembros del grupo #${s.grupoId}...`);
        console.log(`│  🔔 [PUSH]  Enviando alerta a dispositivos...`);
        break;
      }

      case 'USUARIO_UNIDO': {
        const u = mensaje.payload;
        console.log(`│  🙋 USUARIO SE UNIÓ A UN GRUPO`);
        console.log(`│     Usuario:  ${u.nombre} (ID: ${u.usuarioId})`);
        console.log(`│     Grupo:    ${u.nombreGrupo} (ID: ${u.grupoId})`);
        console.log(`│`);
        console.log(`│  📧 [EMAIL] Notificando al organizador del grupo...`);
        console.log(`│  📊 [LOG]   Actualizando contador de miembros...`);
        break;
      }

      case 'MATERIAL_PUBLICADO': {
        const m = mensaje.payload;
        console.log(`│  📄 NUEVO MATERIAL PUBLICADO`);
        console.log(`│     Título:  "${m.titulo}"`);
        console.log(`│     Materia: ${m.materia}`);
        console.log(`│     Autor:   ${m.autor}`);
        console.log(`│     Tipo:    ${m.tipo}`);
        console.log(`│`);
        console.log(`│  📧 [EMAIL] Notificando a suscriptores de ${m.materia}...`);
        console.log(`│  📋 [INDEX] Indexando material en el buscador...`);
        break;
      }

      default:
        console.log(`│  ⚠️  Tipo de evento desconocido: ${mensaje.tipo}`);
    }

    console.log(`└────────────────────────────────────────`);
    console.log('');

  } catch (err) {
    console.error('❌ Error al parsear mensaje:', err.message);
  }
});

// Mantener el proceso vivo
process.on('SIGINT', () => {
  console.log(`\n📊 Total de mensajes recibidos: ${totalRecibidos}`);
  console.log('👋 Suscriptor detenido.');
  sub.disconnect();
  process.exit(0);
});
