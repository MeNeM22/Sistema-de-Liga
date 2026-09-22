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
  public calcularPoderOfensivoTotalJugadores(): number {
    let poderOfensivoTotalJugadores = 0;
    for (const jugador of this.plantilla) {
      poderOfensivoTotalJugadores += jugador.calcularPoderOfensivo() * 1;
    }
    return poderOfensivoTotalJugadores;
  }

  public calcularPoderDefensivoTotalJugadores(): number {
    let poderDefensivoTotalJugadores = 0;
    for (const jugador of this.plantilla) {
      poderDefensivoTotalJugadores += jugador.calcularPoderDefensivo() * -1;
    }
    return poderDefensivoTotalJugadores;
  }

  public calcularPoderOfensivo(): number {
    let cantidadDelanteros = 0;
    let cantidadMediocampistas = 0;
    for (const jugador of this.plantilla) {
      const posicion = jugador.getPosicion();
      if (posicion == "Delantero") {
        cantidadDelanteros++;
      } else if (posicion === "Mediocampista") {
        cantidadMediocampistas++;
      }
    }
    return cantidadDelanteros + 0.5 * cantidadMediocampistas + this.calcularPoderOfensivoTotalJugadores();
  }
  public calcularPoderDefensivo(): number {
    let cantidadDefensores = 0;
    let cantidadArqueros = 0;
    let cantidadMediocampistas = 0;
    for (const jugador of this.plantilla) {
      const posicion = jugador.getPosicion();
      if (posicion == "Defensor") {
        cantidadDefensores++;
      } else if (posicion === "Mediocampista") {
        cantidadMediocampistas++;
      } else if (posicion === "Arquero") {
        cantidadArqueros++;
      }
    }
    return (
      cantidadDefensores + 0.5 * cantidadMediocampistas + cantidadArqueros + this.calcularPoderDefensivoTotalJugadores()
    );
  }
}
