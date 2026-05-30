const GrupoModel = require('../models/grupoModel');

// GET /api/grupos
const getAll = (req, res) => {
    const grupos = GrupoModel.getAll();
    res.status(200).json({ ok: true, data: grupos });
};

// GET /api/grupos/:id
const getById = (req, res) => {
    const id = parseInt(req.params.id);
    const grupo = GrupoModel.getById(id);
    if (!grupo) {
        return res.status(404).json({ ok: false, mensaje: "No existe el grupo con ese id" });
    }
    res.status(200).json({ ok: true, data: grupo });
};

// POST /api/grupos
const create = (req, res) => {
    const { nombre, materia, turno } = req.body;
    if (!nombre)  return res.status(400).json({ ok: false, mensaje: "El campo 'nombre' es obligatorio" });
    if (!materia) return res.status(400).json({ ok: false, mensaje: "El campo 'materia' es obligatorio" });
    if (!turno)   return res.status(400).json({ ok: false, mensaje: "El campo 'turno' es obligatorio" });
    const nuevoGrupo = GrupoModel.create({ nombre, materia, turno, activo: true });
    res.status(201).json({ ok: true, data: nuevoGrupo });
};

// PUT /api/grupos/:id
const update = (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, materia, turno } = req.body;
    if (!nombre || !materia || !turno) {
        return res.status(400).json({ ok: false, mensaje: "Faltan datos requeridos: nombre, materia y turno" });
    }
    const actualizadoGrupo = GrupoModel.update(id, { nombre, materia, turno });
    if (!actualizadoGrupo) {
        return res.status(404).json({ ok: false, mensaje: `No existe un grupo con id ${id}` });
    }
    res.status(200).json({ ok: true, data: actualizadoGrupo });
};

// DELETE /api/grupos/:id
const eliminar = (req, res) => {
    const id = parseInt(req.params.id);
    const eliminado = GrupoModel.delete(id);
    if (!eliminado) {
        return res.status(404).json({ ok: false, mensaje: `No existe un grupo con id ${id}` });
    }
    res.status(200).json({ ok: true, mensaje: `Grupo eliminado correctamente` });
};

module.exports = { getAll, getById, create, update, eliminar };