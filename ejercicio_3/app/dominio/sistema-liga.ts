import Equipo from "../../app/dominio/equipo";
import { IRepositorioLiga } from "../../app/dominio/puerto-repositorio-liga";
import Posicion from "../../app/dominio/posicion";
import Jugador from "./jugador";
import { Arquero, Defensor, Mediocampista, Delantero } from "../../app/dominio/posicion";

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

  public async ficharJugadorPorIdEquipo(
    idEquipo: string,
    nombreJugador: string,
    valorMercado: number,
    nacionalidad: string,
    potencialidad: number,
    posicionString: string,
  ): Promise<Jugador> {
    const liga = await this.repositorioLiga.obtenerLiga();
    const equipo = liga.obtenerEquipoPorID(idEquipo);

    let posicionObjeto: Posicion;
    const posNormalizada = posicionString.toLowerCase();

    if (posNormalizada === "arquero") {
      posicionObjeto = new Arquero();
    } else if (posNormalizada === "defensor") {
      posicionObjeto = new Defensor();
    } else if (posNormalizada === "mediocampista") {
      posicionObjeto = new Mediocampista();
    } else posicionObjeto = new Delantero();

    const nuevoJugador = new Jugador(nombreJugador, valorMercado, nacionalidad, potencialidad, posicionObjeto);

    equipo.ficharJugador(nuevoJugador);

    await this.repositorioLiga.guardar(liga);

    return nuevoJugador;
  }

  public async listarEquipos() {
    const liga = await this.repositorioLiga.obtenerLiga();

    return liga.obtenerEquipos().map((equipo) => ({
      id: equipo.id,
      nombre: equipo.getNombreEquipo(),
      presupuesto: equipo.getPresupuesto(),
      presupuesto_ejecutado: equipo.getPresupuestoEjecutado(),
      estado: equipo.estaCompleto() ? "COMPLETO" : "INCOMPLETO",
    }));
  }

  public async consultarEquipo(idEquipo: string) {
    const liga = await this.repositorioLiga.obtenerLiga();
    const equipoBuscado = liga.obtenerEquipoPorID(idEquipo);
    return {
      id: equipoBuscado.id,
      nombre: equipoBuscado.getNombreEquipo(),
      presupuesto: equipoBuscado.getPresupuesto(),
      presupuesto_ejecutado: equipoBuscado.getPresupuestoEjecutado(),
      estado: equipoBuscado.estaCompleto() ? "COMPLETO" : "INCOMPLETO",
      jugadores: equipoBuscado.getPlantilla().map((jugador: any) => ({
        id: jugador.id,
        nombre: jugador.nombre,
        nacionalidad: jugador.nacionalidad,
        posicion: jugador.getPosicion().constructor.name.toLowerCase(),
        valor_de_mercado: jugador.getValorMercado(),
        potencialidad: jugador.potencialidad,
      })),
      poder_defensivo: equipoBuscado.calcularPoderDefensivo(),
      poder_ofensivo: equipoBuscado.calcularPoderOfensivo(),
    };
  }
}
