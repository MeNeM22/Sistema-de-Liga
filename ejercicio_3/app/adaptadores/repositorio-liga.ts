import { IRepositorioLiga } from "app/dominio/puerto-repositorio-liga";
import Liga from "../../app/dominio/liga";
import clienteRedis from "./cliente-redis";
import Equipo from "../../app/dominio/equipo";

export default class RepositorioLiga implements IRepositorioLiga {
  private readonly CLAVE_LIGA = "liga_argentina";

  guardar(liga: Liga): Promise<void> {
    return clienteRedis(async (cliente) => {
      const equipos = liga.obtenerEquipos();
      await cliente.set(this.CLAVE_LIGA, JSON.stringify(equipos));
    });
  }

  obtenerLiga(): Promise<Liga> {
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
      liga.registrarEquipo(equipo);
    }
    return liga;
  }
}
