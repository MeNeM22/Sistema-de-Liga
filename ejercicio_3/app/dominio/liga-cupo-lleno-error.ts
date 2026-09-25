export default class LigaCupoLlenoError extends Error {
  constructor() {
    super(`La liga ya tiene el cupo maximo de 10 equipos`);
  }
}
