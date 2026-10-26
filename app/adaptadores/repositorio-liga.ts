import { IRepositorioLiga } from "../dominio/puerto-repositorio-liga";
import clienteRedis from "./cliente-redis";
import Liga from "../dominio/liga";
import Equipo from "../dominio/equipo";
import Jugador from "../dominio/jugador";
import FabricaPosicion from "../dominio/fabrica-de-posicion";

export default class RepositorioLiga implements IRepositorioLiga {
  private readonly CLAVE_LIGA = "liga_argentina";

  public guardar(liga: Liga): Promise<void> {
    return clienteRedis(async (cliente) => {
      const equipos = liga.obtenerEquipos().map((equipo) => this.mapearEquipo(equipo));

      await cliente.set(this.CLAVE_LIGA, JSON.stringify(equipos));
    });
  }

  public obtenerLiga(): Promise<Liga> {
    return clienteRedis(async (cliente) => {
      const ligaComoString = await cliente.get(this.CLAVE_LIGA);

      if (!ligaComoString) {
        return new Liga();
      }
      const ligaComoJson = JSON.parse(ligaComoString);
      return this.deserializarLiga(ligaComoJson);
    });
  }

  private deserializarLiga(equiposComoJson: any[]): Liga {
    const liga = new Liga();
    const fabricaPosicion = new FabricaPosicion();
    for (const equipoJson of equiposComoJson) {
      const equipo = new Equipo(equipoJson.nombreEquipo, equipoJson.presupuesto);
      equipo.asignarId(equipoJson.id);

      if (equipoJson.plantilla) {
        for (const jugadorJson of equipoJson.plantilla) {
          const posicionJson = jugadorJson.posicion.tipo;
          const posicion = fabricaPosicion.crear(posicionJson);

          const jugador = new Jugador(
            jugadorJson.nombre,
            jugadorJson.valorMercado,
            jugadorJson.nacionalidad,
            jugadorJson.potencialidad,
            posicion,
          );
          jugador.asignarId(jugadorJson.id);

          equipo.ficharJugador(jugador);
        }
      }
      liga.registrarEquipo(equipo);
    }
    return liga;
  }

  private mapearEquipo(equipo: Equipo) {
    return {
      id: equipo.getId(),
      nombreEquipo: equipo.getNombreEquipo(),
      presupuesto: equipo.getPresupuesto(),
      plantilla: equipo.getPlantilla().map((jugador) => this.mapearJugador(jugador)),
    };
  }

  private mapearJugador(jugador: Jugador) {
    return {
      id: jugador.getId(),
      nombre: jugador.getNombre(),
      valorMercado: jugador.getValorMercado(),
      nacionalidad: jugador.getNacionalidad(),
      potencialidad: jugador.getPotencialidad(),
      posicion: {
        tipo: jugador.getPosicion().nombre(),
      },
    };
  }

  public async resetear(): Promise<void> {
    await clienteRedis((cliente) => cliente.flushDb());
  }
}
