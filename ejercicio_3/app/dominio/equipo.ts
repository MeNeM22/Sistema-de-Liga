import Jugador from "../../app/dominio/jugador";

export default class Equipo {
  private static readonly JUGADORES_MAX = 32;
  private static readonly CARGAS_FISCALES = 0.1;
  private static readonly ARQUEROS_REQUERIDOS = 2;

  private nombreEquipo: string;
  private presupuesto: number;
  private plantilla: Jugador[];
  private estado: string;

  constructor(nombre: string, presupuestoInicial: number) {
    this.nombreEquipo = nombre;
    this.presupuesto = presupuestoInicial;
    this.plantilla = [];
    this.estado = "INCOMPLETO";
  }

  public getNombreEquipo(): string {
    return this.nombreEquipo;
  }

  private getPlantilla(): Jugador[] {
    return this.plantilla;
  }

  public getPresupuesto(): number {
    return this.presupuesto;
  }

  public getEstado(): string {
    return this.estado;
  }

  public getCantidadDeJugadores(): number {
    return this.getPlantilla().length;
  }

  private plantillaEstaLlena(): boolean {
    return this.getCantidadDeJugadores() >= Equipo.JUGADORES_MAX;
  }

  public ficharJugador(jugador: Jugador): void {
    if (this.plantillaEstaLlena()) {
      throw new Error("La plantilla ya esta completa");
    }
    if (this.calcularPresupuestoEjecutado(jugador.getValorMercado()) > this.presupuesto) {
      throw new Error("El presupuesto fue excedido");
    }
    if (jugador.getPosicion().esArquero() && this.contarArquerosEnPlantilla() >= Equipo.ARQUEROS_REQUERIDOS) {
      throw new Error("Cantidad maxima de arqueros alcanzada");
    }
    this.plantilla.push(jugador);
  }

  private calcularPresupuestoEjecutado(valorJugadorNuevo: number): number {
    let valorTotalJugadores: number = 0;
    let cargasFiscales: number = 0;
    for (const jugador of this.plantilla) {
      valorTotalJugadores += jugador.getValorMercado();
    }
    valorTotalJugadores += valorJugadorNuevo;
    cargasFiscales = valorTotalJugadores * Equipo.CARGAS_FISCALES;
    return valorTotalJugadores + cargasFiscales;
  }

  public calcularPoderOfensivo(): number {
    let poderOfensivoTotal: number = 0;
    for (const jugador of this.plantilla) {
      poderOfensivoTotal += jugador.calcularPoderOfensivo();
      poderOfensivoTotal += jugador.getPosicion().poderOfensivoBase();
    }
    return Math.floor(poderOfensivoTotal);
  }

  public calcularPoderDefensivo(): number {
    let poderDefensivotal: number = 0;
    for (const jugador of this.plantilla) {
      poderDefensivotal += jugador.calcularPoderDefensivo() * -1;
      poderDefensivotal += jugador.getPosicion().poderDefensivoBase();
    }
    return Math.floor(poderDefensivotal);
  }

  private contarArquerosEnPlantilla(): number {
    let cantidadArqueros: number = 0;
    for (const jugador of this.plantilla) {
      if (jugador.getPosicion().esArquero()) {
        cantidadArqueros++;
      }
    }
    return cantidadArqueros;
  }
}
