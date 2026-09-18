import PadronDeAlumnoInvalido from "./padron-de-alumno-invalido";

export default class Alumno {
  private nombre: string;
  private apellido: string;
  private padron: string;
  private fechaNacimiento: string;
  public id!: string;

  constructor(nombre: string, apellido: string, padron: string, fechaNacimiento: string) {
    if (padron === undefined) {
      throw new PadronDeAlumnoInvalido();
    }
    this.nombre = nombre;
    this.apellido = apellido;
    this.padron = padron;
    this.fechaNacimiento = fechaNacimiento;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getApellido(): string {
    return this.apellido;
  }

  public getPadron(): string {
    return this.padron;
  }

  public getFechaNacimiento(): string {
    return this.fechaNacimiento;
  }
}
