const express = require('express');
const router  = express.Router();
const grupoController = require('../controllers/gruposController');

/**
 * @swagger
 * tags:
 *   name: Grupos
 *   description: Gestión de grupos de estudio
 */

/**
 * @swagger
 * /api/grupos:
 *   get:
 *     summary: Listar todos los grupos
 *     tags: [Grupos]
 *     responses:
 *       200:
 *         description: Lista de grupos obtenida exitosamente
 */
router.get('/', grupoController.getAll);

/**
 * @swagger
 * /api/grupos/{id}:
 *   get:
 *     summary: Obtener un grupo por ID
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grupo encontrado
 *       404:
 *         description: Grupo no encontrado
 */
router.get('/:id', grupoController.getById);

/**
 * @swagger
 * /api/grupos:
 *   post:
 *     summary: Crear nuevo grupo
 *     tags: [Grupos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, materia, turno]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Grupo Algoritmos
 *               materia:
 *                 type: string
 *                 example: Programación IV
 *               turno:
 *                 type: string
 *                 example: mañana
 *     responses:
 *       201:
 *         description: Grupo creado exitosamente
 *       400:
 *         description: Faltan campos obligatorios
 */
router.post('/', grupoController.create);

/**
 * @swagger
 * /api/grupos/{id}:
 *   put:
 *     summary: Actualizar grupo completo
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, materia, turno]
 *             properties:
 *               nombre:
 *                 type: string
 *               materia:
 *                 type: string
 *               turno:
 *                 type: string
 *     responses:
 *       200:
 *         description: Grupo actualizado
 *       404:
 *         description: Grupo no encontrado
 */
router.put('/:id', grupoController.update);

/**
 * @swagger
 * /api/grupos/{id}:
 *   delete:
 *     summary: Eliminar grupo
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grupo eliminado
 *       404:
 *         description: Grupo no encontrado
 */
router.delete('/:id', grupoController.remove);

module.exports = router;