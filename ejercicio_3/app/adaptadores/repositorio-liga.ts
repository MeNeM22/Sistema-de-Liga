import { IRepositorioLiga } from "app/dominio/puerto-repositorio-liga";
import clienteRedis from "./cliente-redis";
import Liga from "../../app/dominio/liga";
import Equipo from "../../app/dominio/equipo";
import Jugador from "../../app/dominio/jugador";
import Posicion, { Arquero, Defensor, Delantero, Mediocampista } from "../../app/dominio/posicion";
import { v4 as newUuid } from "uuid";

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
      equipo.id = equipoJson.id;

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
          jugador.id = jugadorJson.id;

          equipo.ficharJugador(jugador);
        }
      }
      liga.registrarEquipo(equipo);
    }
    return liga;
  }

  private mapearEquipo(equipo: Equipo) {
    if (!equipo.id) {
      equipo.id = `e:${newUuid().toString()}`;
    }
    return {
      id: equipo.id,
      nombreEquipo: equipo.getNombreEquipo(),
      presupuesto: equipo.getPresupuesto(),
      plantilla: equipo.getPlantilla().map((jugador) => this.mapearJugador(jugador)),
    };
  }

  private mapearJugador(jugador: Jugador) {
    if (!jugador.id) {
      jugador.id = `j:${newUuid().toString()}`;
    }
    return {
      id: jugador.id,
      nombre: jugador.getNombre(),
      valorMercado: jugador.getValorMercado(),
      nacionalidad: jugador.getNacionalidad(),
      potencialidad: jugador.getPotencialidad(),
      posicion: {
        tipo: this.extraerTipoPosicion(jugador.getPosicion()),
      },
    };
  }

  public extraerTipoPosicion(posicion: Posicion): string {
    if (posicion instanceof Delantero) {
      return "delantero";
    } else if (posicion instanceof Defensor) {
      return "defensor";
    } else if (posicion instanceof Mediocampista) {
      return "mediocampista";
    } else if (posicion instanceof Arquero) {
      return "arquero";
    }
    throw new Error("Posición no reconocida");
  }

  public fabricarPosicion(tipoPosicion: string): Posicion {
    const posicionNormalizado: string = tipoPosicion.toLowerCase();
    if (posicionNormalizado === "delantero") {
      return new Delantero();
    } else if (posicionNormalizado === "defensor") {
      return new Defensor();
    } else if (posicionNormalizado === "mediocampista") {
      return new Mediocampista();
    } else if (posicionNormalizado === "arquero") {
      return new Arquero();
    }
    throw new Error(`Posicion desconocida en base de datos`);
  }

  public async resetear(): Promise<void> {
    await clienteRedis((cliente) => cliente.flushDb());
  }
}
