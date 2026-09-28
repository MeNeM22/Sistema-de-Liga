import Equipo from "../../app/dominio/equipo";

import LigaCupoLlenoError from "../../app/dominio/liga-cupo-lleno-error";
import LigaPresupuestoExcedidoError from "../../app/dominio/liga-presupuesto-excedido-error";
import LigaEquipoRepetidoError from "../../app/dominio/liga-equipo-repetido-error";

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
      throw new LigaPresupuestoExcedidoError();
    }

    if (this.equipos.has(clave)) {
      throw new LigaEquipoRepetidoError();
    }

    this.equipos.set(clave, equipo);
  }

  public obtenerEquipos(): Equipo[] {
    return Array.from(this.equipos.values());
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

  public obtenerEquipoPorID(id: string): Equipo {
    const equipos = this.obtenerEquipos();
    for (const equipo of equipos) {
      if (equipo.id === id) {
        return equipo;
      }
    }
    throw new Error(`El equipo ${id} no existe en la liga`);
  }
}
