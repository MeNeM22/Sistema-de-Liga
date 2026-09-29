import Posicion from "../../app/dominio/posicion";
import JugadorPotencialidadInvalidaError from "../../app/dominio/clases-de-errores/jugador-potencialidad-invalida-error";
import JugadorValorMercadoNegativoError from "../../app/dominio/clases-de-errores/jugador-valor-mercado-negativo-error";

export default class Jugador {
  private static readonly POTENCIALIDAD_MIN = 0;
  private static readonly POTENCIALIDAD_MAX = 5;

  private nombre: string;
  private valorMercado: number;
  private nacionalidad: string;
  private potencialidad: number;
  private posicion: Posicion;
  private id?: string;

  constructor(nombre: string, valorMercado: number, nacionalidad: string, potencialidad: number, posicion: Posicion) {
    if (potencialidad < Jugador.POTENCIALIDAD_MIN || potencialidad > Jugador.POTENCIALIDAD_MAX) {
      throw new JugadorPotencialidadInvalidaError();
    }

    if (valorMercado < 0) {
      throw new JugadorValorMercadoNegativoError();
    }

    if (typeof nombre !== "string" || nombre.trim() === "") {
      throw new Error("El nombre de jugador es invalido");
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

  public getId(): string | undefined {
    return this.id;
  }

  public asignarId(id: string): void {
    if (this.id !== undefined) {
      return;
    }

    this.id = id;
  }
}
