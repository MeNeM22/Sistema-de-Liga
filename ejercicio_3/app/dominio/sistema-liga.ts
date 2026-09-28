import Equipo from "../../app/dominio/equipo";
import { IRepositorioLiga } from "../../app/dominio/puerto-repositorio-liga";

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
}
