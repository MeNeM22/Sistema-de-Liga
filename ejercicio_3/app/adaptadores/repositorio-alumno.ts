import Alumno from "../dominio/alumno";
import AlumnoNoEncontradoError from "../dominio/alumno-no-encontrado-error";
import clienteRedis from "./cliente-redis";
import { IRepositorioAlumno } from "../dominio/puerto-repositorio-alumno";
import { v4 as newUuid } from "uuid";

const OPERACION_REDIS_EXITOSA = "OK";

export default class RepositorioAlumno implements IRepositorioAlumno {
  guardar(alumno: Alumno): Promise<boolean> {
    return clienteRedis(async (cliente) => {
      if (!alumno.id) {
        alumno.id = `a:${newUuid().toString()}`;
      }
      const alumnoSerializado = {
        nombre: alumno.getNombre(),
        apellido: alumno.getApellido(),
        padron: alumno.getPadron(),
        fechaNacimiento: alumno.getFechaNacimiento(),
      };
      const res = await cliente.set(alumno.id, JSON.stringify(alumnoSerializado));
      return res === OPERACION_REDIS_EXITOSA;
    });
  }

  recuperar(id: string): Promise<Alumno> {
    return clienteRedis(async (cliente) => {
      const alumnoComoString = await cliente.get(id);

      if (alumnoComoString) {
        const alumnoComoJson = JSON.parse(alumnoComoString);
        return this.deserializarAlumno(alumnoComoJson);
      } else {
        throw new AlumnoNoEncontradoError(id);
      }
    });
  }

  listarAlumnos(): Promise<Alumno[]> {
    return clienteRedis(async (cliente) => {
      const clavesDeAlumnosExistentes = await cliente.keys("a:*");

      if (clavesDeAlumnosExistentes.length === 0) {
        return [];
      }

      const values = await cliente.mGet(clavesDeAlumnosExistentes);
      return values
        .filter((v) => v !== null)
        .map((alumnoComoString) => this.deserializarAlumno(JSON.parse(alumnoComoString!)));
    });
  }

  eliminar(id: string): Promise<void> {
    return clienteRedis(async (cliente) => {
      const resultado = await cliente.del(id);

      if (resultado === 0) {
        throw new AlumnoNoEncontradoError(id);
      }
    });
  }

  private deserializarAlumno(alumnoComoJson: any): Alumno {
    return new Alumno(
      alumnoComoJson["nombre"],
      alumnoComoJson["apellido"],
      alumnoComoJson["padron"],
      alumnoComoJson["fechaNacimiento"],
    );
  }
}
