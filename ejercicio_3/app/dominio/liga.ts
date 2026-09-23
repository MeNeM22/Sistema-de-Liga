import Equipo from "../../app/dominio/equipo";

export default class Liga {
  private static readonly EQUIPOS_MAX = 10;
  private equipos: Equipo[];
  constructor() {
    this.equipos = [];
  }
  public registrarEquipo(equipo: Equipo): void {
    if (this.cantidadEquiposRegistrados() >= Liga.EQUIPOS_MAX) {
      throw new Error("La liga ya tiene el cupo maximo de 10 equipos");
    }
    this.equipos.push(equipo);
  }
  private cantidadEquiposRegistrados(): number {
    return this.equipos.length;
  }
}
