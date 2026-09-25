export default class EquipoPresupuestoExcedidoError extends Error {
  constructor(presupuestoInicial: number) {
    super(`El presupuesto de ${presupuestoInicial} fue excedido`);
  }
}
