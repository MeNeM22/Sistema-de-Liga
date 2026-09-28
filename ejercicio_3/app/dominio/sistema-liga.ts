import Equipo from "../../app/dominio/equipo";
import { IRepositorioLiga } from "../../app/dominio/puerto-repositorio-liga";
import Posicion from "../../app/dominio/posicion";
import Jugador from "./jugador";

export default class SistemaLiga {
  private repositorioLiga: IRepositorioLiga;

  constructor(repoLiga: IRepositorioLiga) {
    this.repositorioLiga = repoLiga;
  }

  public async registrarEquipo(nombre: string, presupuesto: number): Promise<Equipo> {
    const liga = await this.repositorioLiga.obtenerLiga();
    const nuevoEquipo = new Equipo(nombre, presupuesto);

    liga.registrarEquipo(nuevoEquipo);

    await this.repositorioLiga.guardar(liga);

    return nuevoEquipo;
  }

  public async ficharJugador(
    nombreEquipo: string,
    nombreJugador: string,
    valorMercado: number,
    nacionalidad: string,
    potencialidad: number,
    posicion: Posicion,
  ): Promise<Jugador> {
    const liga = await this.repositorioLiga.obtenerLiga();
    const equipo = liga.getEquipo(nombreEquipo);
    const nuevoJugador = new Jugador(nombreJugador, valorMercado, nacionalidad, potencialidad, posicion);

    if (!equipo) {
      throw new Error(`El equipo ${nombreEquipo} no existe en la liga`);
    }

    equipo.ficharJugador(nuevoJugador);

    await this.repositorioLiga.guardar(liga);

    return nuevoJugador;
  }
}
