export type Posicion = "Arquero" | "Defensor" | "Mediocampista" | "Delantero";
export default class Jugador {
  private valorMercado: number;
  private nacionalidad: string;
  private potencialidad: number;
  private posicion: Posicion;
  constructor(valorMercado: number, nacionalidad: string, potencialidad: number, posicion: Posicion) {
    if (potencialidad < 0 || potencialidad > 5) {
      throw new Error("La potencialidad es invalida");
    }
    this.valorMercado = valorMercado;
    this.nacionalidad = nacionalidad;
    this.potencialidad = potencialidad;
    this.posicion = posicion;
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
  public getPosicion() {
    return this.posicion;
  }
  public calcularPoderOfensivo() {
    return this.getPotencialidad() * 1;
  }
}
