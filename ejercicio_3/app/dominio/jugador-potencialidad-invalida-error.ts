export default class JugadorPotencialidadInvalidaError extends Error {
  constructor() {
    super(`La potencialidad ingresada es invalida`);
  }
}
