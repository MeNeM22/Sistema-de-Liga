import Alumno from "./alumno";
import { IRepositorioAlumno } from "./puerto-repositorio-alumno";

export default class SistemaAlumnos {
  private repositorioAlumno: IRepositorioAlumno;

  constructor(repoAlumno: IRepositorioAlumno) {
    this.repositorioAlumno = repoAlumno;
  }
  public async crearAlumno(padron: string, nombre: string, apellido: string, fechaNacimiento: string): Promise<Alumno> {
    const alumnoCreado = new Alumno(nombre, apellido, padron, fechaNacimiento);

    await this.repositorioAlumno.guardar(alumnoCreado);

    return alumnoCreado;
  }

  public async obtenerAlumnos(): Promise<Alumno[]> {
    return await this.repositorioAlumno.listarAlumnos();
  }

  public async obtenerAlumno(id: string): Promise<Alumno> {
    return this.repositorioAlumno.recuperar(id);
  }

  public async obtenerAlumnoPorPadron(padron: string): Promise<Alumno[]> {
    const alumnos = await this.repositorioAlumno.listarAlumnos();

    return alumnos.filter((alumno) => alumno.getPadron() === padron);
  }

  public async eliminarAlumno(padron: string): Promise<void> {
    return this.repositorioAlumno.eliminar(padron);
  }
}
