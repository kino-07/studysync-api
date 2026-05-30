// ============================================================
// PUBLISHER.JS — Publica eventos en canales de Redis
// Ejecutar en Terminal 1: node pubsub/publisher.js
// ============================================================
require('dotenv').config();
const Redis = require('ioredis');

// Conexión al Redis de Upstash usando la variable de entorno
const pub = new Redis(process.env.REDIS_URL);

pub.on('connect', () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   StudySync — Publicador Redis Pub/Sub   ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('✅ Conectado a Upstash Redis');
  console.log('');
  iniciarPublicaciones();
});

pub.on('error', (err) => {
  console.error('❌ Error en publicador:', err.message);
  process.exit(1);
});

// ── Función para publicar un mensaje estructurado ─────────
async function publicar(canal, tipo, payload) {
  const mensaje = JSON.stringify({
    tipo,
    payload,
    timestamp: new Date().toISOString(),
    version:   '1.0'
  });

  await pub.publish(canal, mensaje);

  console.log(`📤 Publicado en [${canal}]`);
  console.log(`   tipo:      ${tipo}`);
  console.log(`   payload:   ${JSON.stringify(payload)}`);
  console.log(`   timestamp: ${new Date().toLocaleTimeString('es-BO')}`);
  console.log('');
}

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Simulación de eventos reales de StudySync ─────────────
async function iniciarPublicaciones() {
  console.log('🚀 Iniciando publicación de eventos...');
  console.log('────────────────────────────────────────');
  console.log('');

  // Canal 1: Sesión de estudio creada
  await publicar('study:sesion:creada', 'SESION_CREADA', {
    sesionId:   1,
    grupoId:    1,
    tema:       'Repaso de arrays y recursión',
    fecha:      '2026-05-28',
    duracion:   90,
    lugar:      'Sala A',
    creadoPor:  'Ana López'
  });

  await esperar(2000);

  // Canal 2: Usuario se unió a un grupo
  await publicar('study:usuario:unido', 'USUARIO_UNIDO', {
    usuarioId:   3,
    nombre:      'Carlos Mamani',
    grupoId:     1,
    nombreGrupo: 'Grupo Algoritmos',
    fecha:       new Date().toISOString()
  });

  await esperar(2000);

  // Canal 3: Material publicado
  await publicar('study:material:publicado', 'MATERIAL_PUBLICADO', {
    materialId: 5,
    titulo:     'Guía de ejercicios — Recursión',
    materia:    'Programación IV',
    autor:      'Ana López',
    tipo:       'PDF',
    url:        'https://drive.google.com/ejemplo'
  });

  await esperar(2000);

  // Canal 2: Otro usuario se une
  await publicar('study:usuario:unido', 'USUARIO_UNIDO', {
    usuarioId:   4,
    nombre:      'María Flores',
    grupoId:     2,
    nombreGrupo: 'Grupo Redes',
    fecha:       new Date().toISOString()
  });

  await esperar(2000);

  // Canal 1: Segunda sesión
  await publicar('study:sesion:creada', 'SESION_CREADA', {
    sesionId:   2,
    grupoId:    2,
    tema:       'Modelo OSI — Capas de red',
    fecha:      '2026-05-29',
    duracion:   60,
    lugar:      'Lab 3',
    creadoPor:  'Luis Torrez'
  });

  console.log('════════════════════════════════════════');
  console.log('✅ Todos los eventos publicados');
  console.log('   Revisa la Terminal 2 para ver las');
  console.log('   notificaciones del suscriptor.');
  console.log('════════════════════════════════════════');

  pub.disconnect();
}
