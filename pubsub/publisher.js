require('dotenv').config();
const Redis = require('ioredis');

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
  console.error('❌ Error:', err.message);
  process.exit(1);
});

async function publicar(canal, tipo, payload) {
  const mensaje = JSON.stringify({
    tipo,
    payload,
    timestamp: new Date().toISOString(),
    version: '1.0'
  });
  await pub.publish(canal, mensaje);
  console.log(`📤 Publicado en [${canal}] — tipo: ${tipo}`);
  console.log(`   payload: ${JSON.stringify(payload)}`);
  console.log('');
}

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function iniciarPublicaciones() {
  console.log('🚀 Publicando eventos...');
  console.log('────────────────────────────────────────');
  console.log('');

  await publicar('study:sesion:creada', 'SESION_CREADA', {
    sesionId: 1,
    grupoId: 1,
    tema: 'Repaso de arrays y recursión',
    fecha: '2026-05-28',
    lugar: 'Sala A',
    creadoPor: 'Ana López'
  });

  await esperar(2000);

  await publicar('study:usuario:unido', 'USUARIO_UNIDO', {
    usuarioId: 3,
    nombre: 'Carlos Mamani',
    grupoId: 1,
    nombreGrupo: 'Grupo Algoritmos'
  });

  await esperar(2000);

  await publicar('study:material:publicado', 'MATERIAL_PUBLICADO', {
    materialId: 5,
    titulo: 'Guía de ejercicios — Recursión',
    materia: 'Programación IV',
    autor: 'Ana López'
  });

  await esperar(2000);

  await publicar('study:usuario:unido', 'USUARIO_UNIDO', {
    usuarioId: 4,
    nombre: 'María Flores',
    grupoId: 2,
    nombreGrupo: 'Grupo Redes'
  });

  await esperar(2000);

  await publicar('study:sesion:creada', 'SESION_CREADA', {
    sesionId: 2,
    grupoId: 2,
    tema: 'Modelo OSI — Capas de red',
    fecha: '2026-05-29',
    lugar: 'Lab 3',
    creadoPor: 'Luis Torrez'
  });

  console.log('✅ Todos los eventos publicados');
  pub.disconnect();
}