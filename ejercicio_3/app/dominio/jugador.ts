import Posicion from "../../app/dominio/posicion";
export default class Jugador {
  private static readonly POTENCIALIDAD_MIN = 0;
  private static readonly POTENCIALIDAD_MAX = 5;

  private nombre: string;
  private valorMercado: number;
  private nacionalidad: string;
  private potencialidad: number;
  private posicion: Posicion;

  constructor(nombre: string, valorMercado: number, nacionalidad: string, potencialidad: number, posicion: Posicion) {
    if (potencialidad < Jugador.POTENCIALIDAD_MIN || potencialidad > Jugador.POTENCIALIDAD_MAX) {
      throw new Error("La potencialidad es invalida");
    }
    this.nombre = nombre;
    this.valorMercado = valorMercado;
    this.nacionalidad = nacionalidad;
    this.potencialidad = potencialidad;
    this.posicion = posicion;
  }

  public getNombre(): string {
    return this.nombre;
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
  public getPosicion(): Posicion {
    return this.posicion;
  }

  public calcularPoderOfensivo(): number {
    return this.getPotencialidad() * 1;
  }

  public calcularPoderDefensivo(): number {
    return this.getPotencialidad() * -1;
  }
}
