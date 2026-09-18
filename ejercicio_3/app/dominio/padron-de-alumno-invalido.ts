export default class PadronDeAlumnoInvalido extends Error {
  constructor() {
    super("El campo 'padron' es obligatorio y debe ser distinto de ''");
  }
}
