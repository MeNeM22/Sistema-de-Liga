export default class LigaEquipoNoEncontradoError extends Error {
  constructor(id: string) {
    super(`El equipo ${id} no existe en la liga`);
  }
}
