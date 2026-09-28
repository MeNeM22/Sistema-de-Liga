import { IRepositorioLiga } from "app/dominio/puerto-repositorio-liga";
import clienteRedis from "./cliente-redis";
import Liga from "../../app/dominio/liga";
import Equipo from "../../app/dominio/equipo";
import Jugador from "../../app/dominio/jugador";
import Posicion, { Arquero, Defensor, Delantero, Mediocampista } from "../../app/dominio/posicion";

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
    for (const equipoJson of equiposComoJson) {
      const equipo = new Equipo(equipoJson.nombreEquipo, equipoJson.presupuesto);

      if (equipoJson.plantilla) {
        for (const jugadorJson of equipoJson.plantilla) {
          const posicionJson = jugadorJson.posicion.tipo;
          const posicion = this.fabricarPosicion(posicionJson);

          const jugador = new Jugador(
            jugadorJson.nombre,
            jugadorJson.valorMercado,
            jugadorJson.nacionalidad,
            jugadorJson.potencialidad,
            posicion,
          );
          equipo.ficharJugador(jugador);
        }
      }
      liga.registrarEquipo(equipo);
    }
    return liga;
  }

  private mapearEquipo(equipo: Equipo) {
    return {
      nombreEquipo: equipo.getNombreEquipo(),
      presupuesto: equipo.getPresupuesto(),
      plantilla: equipo.getPlantilla().map((jugador) => ({
        nombre: jugador.getNombre(),
        valorMercado: jugador.getValorMercado(),
        nacionalidad: jugador.getNacionalidad(),
        potencialidad: jugador.getPotencialidad(),
        posicion: {
          tipo: this.extraerTipoPosicion(jugador.getPosicion()),
        },
      })),
    };
  }

  private extraerTipoPosicion(posicion: Posicion): string {
    if (posicion instanceof Delantero) {
      return "Delantero";
    } else if (posicion instanceof Defensor) {
      return "Defensor";
    } else if (posicion instanceof Mediocampista) {
      return "Mediocampista";
    } else if (posicion instanceof Arquero) {
      return "Arquero";
    }
    throw new Error("Posición no reconocida");
  }

  private fabricarPosicion(tipoPosicion: string): Posicion {
    if (tipoPosicion === "Delantero") {
      return new Delantero();
    } else if (tipoPosicion === "Defensor") {
      return new Defensor();
    } else if (tipoPosicion === "Mediocampista") {
      return new Mediocampista();
    } else if (tipoPosicion === "Arquero") {
      return new Arquero();
    }
    throw new Error(`Posicion desconocida en base de datos`);
  }
}
