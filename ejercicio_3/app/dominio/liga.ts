import Equipo from "../../app/dominio/equipo";

export default class Liga {
  private equipos: Equipo[];
  constructor() {
    this.equipos = [];
  }
  public registrarEquipo(equipo: Equipo): void {
    if (this.equipos.length == 10) {
      throw new Error("La liga ya tiene el cupo maximo de 10 equipos");
    }
    this.equipos.push(equipo);
  }
}
