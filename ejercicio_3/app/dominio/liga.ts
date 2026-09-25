import Equipo from "../../app/dominio/equipo";

import LigaCupoLlenoError from "../../app/dominio/liga-cupo-lleno-error";

export default class Liga {
  private static readonly EQUIPOS_MAX = 10;
  private static readonly MONTO_TOTAL_MERCADO = 10000000;
  private equipos: Map<string, Equipo>;

  constructor() {
    this.equipos = new Map<string, Equipo>();
  }

  public getEquipo(nombre: string): Equipo | undefined {
    return this.equipos.get(nombre.toLowerCase());
  }

  public registrarEquipo(equipo: Equipo): void {
    const clave: string = equipo.getNombreEquipo().toLowerCase();
    const inversionNueva: number = this.calcularInversionEjecutada() + equipo.getPresupuesto();

    if (this.cantidadEquiposRegistrados() >= Liga.EQUIPOS_MAX) {
      throw new LigaCupoLlenoError();
    }

    if (inversionNueva > Liga.MONTO_TOTAL_MERCADO) {
      throw new Error("La liga ya alcanzo el presupuesto maximo");
    }

    if (this.equipos.has(clave)) {
      throw new Error("El equipo ya se encuentra registrado");
    }

    this.equipos.set(clave, equipo);
  }

  private cantidadEquiposRegistrados(): number {
    return this.equipos.size;
  }

  private calcularInversionEjecutada(): number {
    let inversionTotal: number = 0;
    for (const equipo of this.equipos.values()) {
      inversionTotal += equipo.getPresupuesto();
    }
    return inversionTotal;
  }
}
