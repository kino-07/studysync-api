const GrupoModel = require('../models/grupoModel');

// GET /api/grupos
const getAll = async (req, res) => {
  try {
    const grupos = await GrupoModel.getAll();
    res.status(200).json({ ok: true, data: grupos });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

// GET /api/grupos/:id
const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const grupo = await GrupoModel.getById(id);
    if (!grupo) return res.status(404).json({ ok: false, mensaje: `No existe grupo con id ${id}` });
    res.status(200).json({ ok: true, data: grupo });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

// POST /api/grupos
const create = async (req, res) => {
  try {
    const { nombre, materia, turno } = req.body;
    if (!nombre)  return res.status(400).json({ ok: false, mensaje: "El campo 'nombre' es obligatorio" });
    if (!materia) return res.status(400).json({ ok: false, mensaje: "El campo 'materia' es obligatorio" });
    if (!turno)   return res.status(400).json({ ok: false, mensaje: "El campo 'turno' es obligatorio" });

    const nuevo = await GrupoModel.create({ nombre, materia, turno, activo: true });

    // Publicar evento en Redis
    try {
      const Redis = require('ioredis');
      const pub = new Redis(process.env.REDIS_URL);
      await pub.publish('study:grupo:creado', JSON.stringify({
        tipo:      'GRUPO_CREADO',
        payload:   nuevo,
        timestamp: new Date().toISOString(),
        version:   '1.0'
      }));
      pub.disconnect();
    } catch (redisErr) {
      console.warn('⚠️ Redis no disponible:', redisErr.message);
    }

    res.status(201).json({ ok: true, data: nuevo });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

// PUT /api/grupos/:id
const update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, materia, turno, activo } = req.body;
    if (!nombre || !materia || !turno) {
      return res.status(400).json({ ok: false, mensaje: "nombre, materia y turno son obligatorios" });
    }
    const actualizado = await GrupoModel.update(id, { nombre, materia, turno, activo });
    if (!actualizado) return res.status(404).json({ ok: false, mensaje: `No existe grupo con id ${id}` });
    res.status(200).json({ ok: true, data: actualizado });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

// DELETE /api/grupos/:id
const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const eliminado = await GrupoModel.delete(id);
    if (!eliminado) return res.status(404).json({ ok: false, mensaje: `No existe grupo con id ${id}` });
    res.status(200).json({ ok: true, mensaje: `Grupo '${eliminado.nombre}' eliminado correctamente` });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };