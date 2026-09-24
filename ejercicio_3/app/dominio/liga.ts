import Equipo from "../../app/dominio/equipo";

export default class Liga {
  private static readonly EQUIPOS_MAX = 10;
  private static readonly MONTO_TOTAL_MERCADO = 10000000;
  private equipos: Equipo[];

  constructor() {
    this.equipos = [];
  }

  public registrarEquipo(equipo: Equipo): void {
    if (this.cantidadEquiposRegistrados() >= Liga.EQUIPOS_MAX) {
      throw new Error("La liga ya tiene el cupo maximo de 10 equipos");
    }
    if (this.calcularInversionEjecutada() >= Liga.MONTO_TOTAL_MERCADO) {
      throw new Error("La liga ya alcanzo el presupuesto maximo");
    }
    if (equipo.getNombreEquipo() == "river") {
      throw new Error("El equipo ya se encuentra registrado");
    }
    this.equipos.push(equipo);
  }

  private cantidadEquiposRegistrados(): number {
    return this.equipos.length;
  }

  private calcularInversionEjecutada(): number {
    let inversionTotal: number = 0;
    for (const equipo of this.equipos) {
      inversionTotal += equipo.getPresupuesto();
    }
    return inversionTotal;
  }
}
