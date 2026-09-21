import Jugador from "../../app/dominio/jugador";
export default class Equipo {
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
  public ficharJugador(jugador: Jugador) {
    if (this.getPlantilla().length < 32) {
      this.plantilla.push(jugador);
    } else {
      throw new Error("La plantilla ya esta completa");
    }
  }
}
