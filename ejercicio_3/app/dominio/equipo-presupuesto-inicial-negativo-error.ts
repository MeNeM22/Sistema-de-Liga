export default class EquipoPresupuestoInicialNegativoError extends Error {
  constructor() {
    super(`El presupuesto inicial no debe ser negativo`);
  }
}
