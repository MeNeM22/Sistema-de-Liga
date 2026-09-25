import Jugador from "../../app/dominio/jugador";
import EquipoPlantillaLlenaError from "../../app/dominio/equipo-plantilla-llena-error";
import EquipoPresupuestoExcedidoError from "../../app/dominio/equipo-presupuesto-excedido-error";

export default class Equipo {
  private static readonly JUGADORES_MAX = 32;
  private static readonly CARGAS_FISCALES = 0.1;
  private static readonly ARQUEROS_REQUERIDOS = 2;

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

  public getPresupuesto(): number {
    return this.presupuesto;
  }

  public getCantidadDeJugadores(): number {
    return this.plantilla.length;
  }

  private plantillaEstaLlena(): boolean {
    return this.getCantidadDeJugadores() == Equipo.JUGADORES_MAX;
  }

  public ficharJugador(jugador: Jugador): void {
    if (this.plantillaEstaLlena()) {
      throw new EquipoPlantillaLlenaError();
    } else if (this.calcularPresupuestoEjecutado(jugador.getValorMercado()) > this.presupuesto) {
      throw new EquipoPresupuestoExcedidoError(this.getPresupuesto());
    } else if (jugador.getPosicion().esArquero() && this.contarArquerosEnPlantilla() >= Equipo.ARQUEROS_REQUERIDOS) {
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

  public estaCompleto(): boolean {
    return this.getCantidadDeJugadores() === Equipo.JUGADORES_MAX && this.contarArquerosEnPlantilla() === 2;
  }
}
