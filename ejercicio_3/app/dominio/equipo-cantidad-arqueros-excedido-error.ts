export default class EquipoCantidadArquerosExcedidoError extends Error {
  constructor() {
    super(`La plantilla excede la cantidad de arqueros maximo`);
  }
}
