export default class JugadorValorMercadoNegativoError extends Error {
  constructor() {
    super(`Valor de mercado no puede ser negativo`);
  }
}
