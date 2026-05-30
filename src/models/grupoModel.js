// Base de datos en memoria (arreglo)
let grupos = [
  { id: 1, nombre: "Grupo Algoritmos", materia: "Programación IV", turno: "mañana", activo: true },
  { id: 2, nombre: "Grupo Redes",      materia: "Redes I",          turno: "tarde",  activo: true }
];

let nextId = 3;

const GrupoModel = {
  getAll: () => grupos,

  getById: (id) => grupos.find(g => g.id === id),

  create: (data) => {
    const nuevo = { id: nextId++, ...data };
    grupos.push(nuevo);
    return nuevo;
  },

  update: (id, data) => {
    const index = grupos.findIndex(g => g.id === id);
    if (index === -1) return null;
    grupos[index] = { id, ...data };
    return grupos[index];
  },

  delete: (id) => {
    const index = grupos.findIndex(g => g.id === id);
    if (index === -1) return null;
    const eliminado = grupos[index];
    grupos.splice(index, 1);
    return eliminado;
  }
};

module.exports = GrupoModel;