export default class EquipoNombreInvalidoError extends Error {
  constructor() {
    super("El nombre del equipo es invalido");
  }
}
