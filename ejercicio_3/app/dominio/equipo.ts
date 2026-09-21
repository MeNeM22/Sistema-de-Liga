import Jugador from "../../app/dominio/jugador";
export default class Equipo {
  private static readonly JUGADORES_MAX = 32;

  private nombreEquipo: string;
  private presupuesto: number;
  private plantilla: Jugador[];
  constructor(nombre: string, presupuestoInicial: number) {
    this.nombreEquipo = nombre;
    this.presupuesto = presupuestoInicial;
    this.plantilla = [];
  }
  public getNombreEquipo(): string {
    return this.nombreEquipo;
  }
  //rompe encapsulamiento, verificar
  public getPlantilla(): Jugador[] {
    return this.plantilla;
  }
  public getPresupuesto(): number {
    return this.presupuesto;
  }
  public getCantidadDeJugadores(): number {
    return this.getPlantilla().length;
  }
  public plantillaEstaLlena(): boolean {
    return this.getCantidadDeJugadores() >= Equipo.JUGADORES_MAX;
  }
  public ficharJugador(jugador: Jugador): void {
    if (this.plantillaEstaLlena()) {
      throw new Error("La plantilla ya esta completa");
    }
    this.plantilla.push(jugador);
  }
}
