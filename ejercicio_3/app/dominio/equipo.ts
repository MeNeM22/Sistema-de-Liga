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
  public calcularPoderOfensivo(): number {
    let cantidadDelanteros = 0;
    let cantidadMediocampistas = 0;
    let poderOfensivoTotalJugadores = 0;
    for (const jugador of this.plantilla) {
      const posicion = jugador.getPosicion();
      if (posicion == "Delantero") {
        cantidadDelanteros++;
      } else if (posicion === "Mediocampista") {
        cantidadMediocampistas++;
      }
      poderOfensivoTotalJugadores += jugador.calcularPoderOfensivo() * 1;
    }
    return cantidadDelanteros + 0.5 * cantidadMediocampistas + poderOfensivoTotalJugadores;
  }
}
