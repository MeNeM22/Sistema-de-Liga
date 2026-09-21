export type Posicion = "Arquero" | "Defensor" | "Mediocampista" | "Delantero";
export default class Jugador {
  private static readonly POTENCIALIDAD_MIN = 0;
  private static readonly POTENCIALIDAD_MAX = 5;

  private valorMercado: number;
  private nacionalidad: string;
  private potencialidad: number;
  private posicion: Posicion;

  constructor(valorMercado: number, nacionalidad: string, potencialidad: number, posicion: Posicion) {
    if (potencialidad < Jugador.POTENCIALIDAD_MIN || potencialidad > Jugador.POTENCIALIDAD_MAX) {
      throw new Error("La potencialidad es invalida");
    }
    this.valorMercado = valorMercado;
    this.nacionalidad = nacionalidad;
    this.potencialidad = potencialidad;
    this.posicion = posicion;
  }

  public getValorMercado(): number {
    return this.valorMercado;
  }
  public getNacionalidad(): string {
    return this.nacionalidad;
  }

  public getPotencialidad(): number {
    return this.potencialidad;
  }
  public getPosicion(): string {
    return this.posicion;
  }
  public calcularPoderOfensivo(): number {
    return this.getPotencialidad() * 1;
  }

  public calcularPoderDefensivo(): number {
    return -2;
  }
}
