export default class Jugador {
  private valorMercado: number;
  private nacionalidad: string;
  private potencialidad: number;

  constructor(valorMercado: number, nacionalidad: string, potencialidad: number) {
    if (potencialidad < 0 || potencialidad > 5) {
      throw new Error("La potencialidad es invalida");
    }
    this.valorMercado = valorMercado;
    this.nacionalidad = nacionalidad;
    this.potencialidad = potencialidad;
  }
  public getValorMercado() {
    return this.valorMercado;
  }
  public getNacionalidad() {
    return this.nacionalidad;
  }

  public getPotencialidad() {
    return this.potencialidad;
  }
}
