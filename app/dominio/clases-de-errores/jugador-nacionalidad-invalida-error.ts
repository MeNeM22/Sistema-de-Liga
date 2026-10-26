export default class JugadorNacionalidadInvalidaError extends Error {
  constructor() {
    super("La nacionalidad de jugador es invalida");
  }
}
