import { IRepositorioLiga } from "app/dominio/puerto-repositorio-liga";
import clienteRedis from "./cliente-redis";
import Liga from "../../app/dominio/liga";
import Equipo from "../../app/dominio/equipo";
import Jugador from "../../app/dominio/jugador";
import { Arquero, Defensor, Delantero, Mediocampista } from "../../app/dominio/posicion";

export default class RepositorioLiga implements IRepositorioLiga {
  private readonly CLAVE_LIGA = "liga_argentina";

  public guardar(liga: Liga): Promise<void> {
    return clienteRedis(async (cliente) => {
      const equipos = liga.obtenerEquipos().map((equipo) => ({
        nombreEquipo: equipo.getNombreEquipo(),
        presupuesto: equipo.getPresupuesto(),

        plantilla: equipo.getPlantilla().map((jugador) => {
          const posicion = jugador.getPosicion();

          let tipoPosicion: string;

          if (posicion instanceof Arquero) {
            tipoPosicion = "Arquero";
          } else if (posicion instanceof Delantero) {
            tipoPosicion = "Delantero";
          } else if (posicion instanceof Defensor) {
            tipoPosicion = "Defensor";
          } else if (posicion instanceof Mediocampista) {
            tipoPosicion = "Mediocampista";
          } else {
            throw new Error("Posición no reconocida");
          }

          return {
            nombre: jugador.getNombre(),
            valorMercado: jugador.getValorMercado(),
            nacionalidad: jugador.getNacionalidad(),
            potencialidad: jugador.getPotencialidad(),
            posicion: {
              tipo: tipoPosicion,
            },
          };
        }),
      }));

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
          let posicion;

          if (posicionJson === "Delantero") {
            posicion = new Delantero();
          } else if (posicionJson === "Defensor") {
            posicion = new Defensor();
          } else if (posicionJson === "Mediocampista") {
            posicion = new Mediocampista();
          } else if (posicionJson === "Arquero") {
            posicion = new Arquero();
          }
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
}
