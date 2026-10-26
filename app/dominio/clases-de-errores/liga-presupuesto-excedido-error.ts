export default class LigaPresupuestoExcedidoError extends Error {
  constructor() {
    super(`La liga ya alcanzo el presupuesto maximo`);
  }
}
