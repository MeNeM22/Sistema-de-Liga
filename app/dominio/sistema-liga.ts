import Equipo from "../../app/dominio/equipo";
import { IRepositorioLiga } from "../../app/dominio/puerto-repositorio-liga";
import Jugador from "./jugador";
import FabricaPosicion from "../../app/dominio/fabrica-de-posicion";
import { v4 as newUuid } from "uuid";

export default class SistemaLiga {
  private repositorioLiga: IRepositorioLiga;

  constructor(repoLiga: IRepositorioLiga) {
    this.repositorioLiga = repoLiga;
  }

  public async registrarEquipo(nombre: string, presupuesto: number): Promise<Equipo> {
    const liga = await this.repositorioLiga.obtenerLiga();
    const nuevoEquipo = new Equipo(nombre, presupuesto);
    nuevoEquipo.asignarId(`e:${newUuid().toString()}`);

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

    const fabricaPosicion = new FabricaPosicion();

    const posicionObjeto = fabricaPosicion.crear(posicionString);
    const nuevoJugador = new Jugador(nombreJugador, valorMercado, nacionalidad, potencialidad, posicionObjeto);
    nuevoJugador.asignarId(`j:${newUuid().toString()}`);
    equipo.ficharJugador(nuevoJugador);

    await this.repositorioLiga.guardar(liga);

    return nuevoJugador;
  }

  public async listarEquipos() {
    const liga = await this.repositorioLiga.obtenerLiga();

    return liga.obtenerEquipos().map((equipo) => ({
      id: equipo.getId(),
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
      id: equipoBuscado.getId(),
      nombre: equipoBuscado.getNombreEquipo(),
      presupuesto: equipoBuscado.getPresupuesto(),
      presupuesto_ejecutado: equipoBuscado.getPresupuestoEjecutado(),
      estado: equipoBuscado.estaCompleto() ? "COMPLETO" : "INCOMPLETO",
      jugadores: equipoBuscado.getPlantilla().map((jugador: Jugador) => ({
        id: jugador.getId(),
        nombre: jugador.getNombre(),
        nacionalidad: jugador.getNacionalidad(),
        posicion: jugador.getPosicion().nombre(),
        valor_de_mercado: jugador.getValorMercado(),
        potencialidad: jugador.getPotencialidad(),
      })),
      poder_defensivo: equipoBuscado.calcularPoderDefensivo(),
      poder_ofensivo: equipoBuscado.calcularPoderOfensivo(),
    };
  }

  public async resetearSistema(): Promise<void> {
    await this.repositorioLiga.resetear();
  }
}
