export default class LigaEquipoRepetidoError extends Error {
  constructor() {
    super(`El equipo ya se encuentra registrado en la liga`);
  }
}
