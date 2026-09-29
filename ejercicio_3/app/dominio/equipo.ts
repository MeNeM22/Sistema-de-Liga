import Jugador from "../../app/dominio/jugador";

import EquipoPlantillaLlenaError from "../../app/dominio/clases-de-errores/equipo-plantilla-llena-error";
import EquipoPresupuestoExcedidoError from "../../app/dominio/clases-de-errores/equipo-presupuesto-excedido-error";
import EquipoCantidadArquerosExcedidoError from "../../app/dominio/clases-de-errores/equipo-cantidad-arqueros-excedido-error";
import EquipoPresupuestoInicialNegativoError from "../../app/dominio/clases-de-errores/equipo-presupuesto-inicial-negativo-error";

export default class Equipo {
  private static readonly JUGADORES_MAX = 32;
  private static readonly CARGAS_FISCALES = 0.1;
  private static readonly ARQUEROS_REQUERIDOS = 2;

  private nombreEquipo: string;
  private presupuesto: number;
  private plantilla: Jugador[];
  private id?: string;

  constructor(nombre: string, presupuestoInicial: number) {
    if (presupuestoInicial < 0) {
      throw new EquipoPresupuestoInicialNegativoError();
    }
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

  public ficharJugador(jugador: Jugador): void {
    if (this.plantillaEstaLlena()) {
      throw new EquipoPlantillaLlenaError();
    } else if (this.calcularInversionFutura(jugador.getValorMercado()) > this.presupuesto) {
      throw new EquipoPresupuestoExcedidoError(this.getPresupuesto());
    } else if (jugador.getPosicion().esArquero() && this.contarArquerosEnPlantilla() >= Equipo.ARQUEROS_REQUERIDOS) {
      throw new EquipoCantidadArquerosExcedidoError();
    }
    this.plantilla.push(jugador);
  }

  public getPresupuestoEjecutado(): number {
    let valorTotalJugadores: number = 0;
    for (const jugador of this.plantilla) {
      valorTotalJugadores += jugador.getValorMercado();
    }
    const cargasFiscales = valorTotalJugadores * Equipo.CARGAS_FISCALES;
    return valorTotalJugadores + cargasFiscales;
  }

  public getCantidadDeJugadores(): number {
    return this.plantilla.length;
  }

  public getPlantilla(): Jugador[] {
    return [...this.plantilla];
  }

  private plantillaEstaLlena(): boolean {
    return this.getCantidadDeJugadores() == Equipo.JUGADORES_MAX;
  }

  private calcularInversionFutura(valorJugadorNuevo: number): number {
    const costoNuevoJugador = valorJugadorNuevo + valorJugadorNuevo * Equipo.CARGAS_FISCALES;

    return this.getPresupuestoEjecutado() + costoNuevoJugador;
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
    return (
      this.getCantidadDeJugadores() === Equipo.JUGADORES_MAX &&
      this.contarArquerosEnPlantilla() === Equipo.ARQUEROS_REQUERIDOS
    );
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
