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
    if (equipo.getPresupuesto() == 1000) {
      throw new Error("La liga ya alcanzo el presupuesto maximo");
    }
    this.equipos.push(equipo);
  }
  private cantidadEquiposRegistrados(): number {
    return this.equipos.length;
  }
}
