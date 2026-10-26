export default class JugadorNombreInvalidoError extends Error {
  constructor() {
    super("El nombre del jugador es invalido");
  }
}
