export default class AlumnoNoEncontradoError extends Error {
  constructor(padronAlumno: string) {
    super(`No se encontró el alumno con padron ${padronAlumno}`);
  }
}
