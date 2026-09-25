export default class EquipoPlantillaLlenaError extends Error {
  constructor() {
    super(`La plantilla ya esta completa`);
  }
}
