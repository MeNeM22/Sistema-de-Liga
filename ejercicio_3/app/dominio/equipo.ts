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
    if (this.calcularPresupuestoEjecutado(jugador.getValorMercado()) > this.presupuesto){
      throw new Error("El presupuesto fue excedido");
    }
    this.plantilla.push(jugador);
  }
  private calcularPresupuestoEjecutado(valorJugadorNuevo: number): number{
    let presupuestoEjecutado = 0;
    let valorTotalJugadores = 0;
    for (const jugador of this.plantilla) {
      valorTotalJugadores += jugador.getValorMercado();
    }
    valorTotalJugadores += valorJugadorNuevo;
    presupuestoEjecutado = valorTotalJugadores + 0.10;
    return presupuestoEjecutado
  }
  private calcularPoderOfensivoTotalJugadores(): number {
    let poderOfensivoTotalJugadores = 0;
    for (const jugador of this.plantilla) {
      poderOfensivoTotalJugadores += jugador.calcularPoderOfensivo() * 1;
    }
    return poderOfensivoTotalJugadores;
  }

  private calcularPoderDefensivoTotalJugadores(): number {
    let poderDefensivoTotalJugadores = 0;
    for (const jugador of this.plantilla) {
      poderDefensivoTotalJugadores += jugador.calcularPoderDefensivo() * -1;
    }
    return poderDefensivoTotalJugadores;
  }

  private contarJugadoresPorPosicion(posicionBuscada: string): number {
    let cantidadEnPosicionBuscada = 0;
    for (const jugador of this.plantilla) {
      if (jugador.getPosicion() == posicionBuscada) {
        cantidadEnPosicionBuscada++;
      }
    }
    return cantidadEnPosicionBuscada;
  }

  public calcularPoderOfensivo(): number {
    return (
      this.contarJugadoresPorPosicion("Delantero") +
      0.5 * this.contarJugadoresPorPosicion("Mediocampista") +
      this.calcularPoderOfensivoTotalJugadores()
    );
  }
  public calcularPoderDefensivo(): number {
    return (
      this.contarJugadoresPorPosicion("Defensor") +
      0.5 * this.contarJugadoresPorPosicion("Mediocampista") +
      this.contarJugadoresPorPosicion("Arquero") +
      this.calcularPoderDefensivoTotalJugadores()
    );
  }
}
