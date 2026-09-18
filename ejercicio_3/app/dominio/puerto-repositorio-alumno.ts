import Alumno from "./alumno";

export class NoSePuedeCalcularClaveError extends Error {
  constructor() {
    super("No se puede calcular la clave para persistir al alumno, el Padrón debe ser un string no vacío");
  }
}

export interface IRepositorioAlumno {
  guardar(alumno: Alumno): Promise<boolean>;

  recuperar(padron: string): Promise<Alumno>;

  listarAlumnos(): Promise<Alumno[]>;

  eliminar(padron: string): Promise<void>;
}
