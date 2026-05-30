const prisma = require('../prismaClient');

const GrupoModel = {

  getAll: async () => {
    return await prisma.grupo.findMany({
      orderBy: { creadoEn: 'desc' }
    });
  },

  getById: async (id) => {
    return await prisma.grupo.findUnique({
      where: { id }
    });
  },

  create: async (data) => {
    return await prisma.grupo.create({
      data: {
        nombre:  data.nombre,
        materia: data.materia,
        turno:   data.turno,
        activo:  data.activo ?? true
      }
    });
  },

  update: async (id, data) => {
    try {
      return await prisma.grupo.update({
        where: { id },
        data: {
          nombre:  data.nombre,
          materia: data.materia,
          turno:   data.turno,
          activo:  data.activo
        }
      });
    } catch {
      return null;
    }
  },

  delete: async (id) => {
    try {
      return await prisma.grupo.delete({
        where: { id }
      });
    } catch {
      return null;
    }
  }
};

module.exports = GrupoModel;