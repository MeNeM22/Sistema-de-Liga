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
  public getNombreEquipo() {
    return this.nombreEquipo;
  }
  public getPlantilla() {
    return this.plantilla;
  }
  public getPresupuesto() {
    return this.presupuesto;
  }
  public getCantidadDeJugadores() {
    return this.getPlantilla().length;
  }
  public ficharJugador(jugador: Jugador) {
    if (this.getCantidadDeJugadores() >= Equipo.JUGADORES_MAX) {
      throw new Error("La plantilla ya esta completa");
    }
    this.plantilla.push(jugador);
  }
}
