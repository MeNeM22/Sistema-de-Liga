import Alumno from "../../app/dominio/alumno";
import AlumnoNoEncontradoError from "../../app/dominio/alumno-no-encontrado-error";
import clienteRedis from "../../app/adaptadores/cliente-redis";
import { describe, expect, test } from "@jest/globals";
import RepositorioAlumno from "../../app/adaptadores/repositorio-alumno";

describe("RepositorioAlumno", () => {
  afterEach(async () => {
    // Borrar todos los datos en Redis despuúes de ejecutar cada prueba
    await clienteRedis((cliente) => cliente.flushDb());
  });

  const repositorioAlumno = new RepositorioAlumno();

  describe("guardar", () => {
    test("deberia persistir un alumno y asignar un id de persistencia", async () => {
      const alumna = new Alumno("Juana", "Rodriguez", "123456", "01/01/2000");

      const resultado = await repositorioAlumno.guardar(alumna);

      expect(resultado).toBeTruthy();
      expect(alumna.id).toBeTruthy();
    });
  });

  describe("recuperar", () => {
    test("deberia devolver un objeto alumno con los datos recuperados del SET de redis", async () => {
      const padronAlumna = "987654";
      const alumna = new Alumno("Ana", "Lopez", padronAlumna, "31/12/2000");
      const resultado = await repositorioAlumno.guardar(alumna);
      expect(resultado).toBeTruthy();

      const alumnaRecuperada = await repositorioAlumno.recuperar(alumna.id);

      expect(alumnaRecuperada).not.toBeNull();
      expect(alumnaRecuperada.getPadron()).toBe(padronAlumna);
      expect(alumnaRecuperada.getNombre()).toBe("Ana");
      expect(alumnaRecuperada.getApellido()).toBe("Lopez");
      expect(alumnaRecuperada.getFechaNacimiento()).toBe("31/12/2000");
    });

    test("deberia encontrar el registro si existe más de un alumno persistido", async () => {
      const alumna1 = new Alumno("Juana", "Rodriguez", "123456", "01/01/2000");
      await repositorioAlumno.guardar(alumna1);
      const alumna2 = new Alumno("Ana", "Lopez", "987654", "31/12/2000");
      await repositorioAlumno.guardar(alumna2);

      const alumnaRecuperada1 = await repositorioAlumno.recuperar(alumna1.id);
      expect(alumnaRecuperada1.getPadron()).toBe("123456");

      const alumnaRecuperada2 = await repositorioAlumno.recuperar(alumna2.id);
      expect(alumnaRecuperada2.getPadron()).toBe("987654");
    });

    test("deberia arrojar una excepción de tipo AlumnoNoEncontradoError si no se encuentra el registro del alumno en redis", async () => {
      await expect(repositorioAlumno.recuperar("no-existe")).rejects.toThrowError(AlumnoNoEncontradoError);
    });
  });

  describe("listarAlumnos", () => {
    test("deberia devolver un arreglo vacio si no hay alumnos guardados", async () => {
      const listaAlumnos = await repositorioAlumno.listarAlumnos();

      expect(listaAlumnos.length).toBe(0);
    });

    test("debería devolver arreglo con un único elemento cuando hay un solo alumno guardado", async () => {
      const alumna = new Alumno("Ana", "Lopez", "123456", "31/12/2000");
      await repositorioAlumno.guardar(alumna);

      const listaAlumnos = await repositorioAlumno.listarAlumnos();

      expect(listaAlumnos.length).toBe(1);
      expect(listaAlumnos[0].getPadron()).toBe("123456");
    });

    test("deberia devolver arreglo con todos los alumnos guardados si hay mas de uno", async () => {
      const alumna1 = new Alumno("Juana", "Rodriguez", "123456", "01/01/2000");
      await repositorioAlumno.guardar(alumna1);
      const alumna2 = new Alumno("Ana", "Lopez", "987654", "31/12/2000");
      await repositorioAlumno.guardar(alumna2);
      const alumno3 = new Alumno("Federico", "Garcia", "456123", "01/06/2000");
      await repositorioAlumno.guardar(alumno3);

      const listaAlumnos = await repositorioAlumno.listarAlumnos();

      expect(listaAlumnos.length).toBe(3);
      const padronDeAlumnosListados = listaAlumnos.map((alumno) => alumno.getPadron());
      expect(padronDeAlumnosListados).toContain("123456");
      expect(padronDeAlumnosListados).toContain("987654");
      expect(padronDeAlumnosListados).toContain("456123");
    });
  });

  describe("eliminar", () => {
    test("deberia eliminar el alumno de Redis cuando existe", async () => {
      const alumno = new Alumno("Juan", "Perez", "12345", "01/01/1990");
      await repositorioAlumno.guardar(alumno);

      await repositorioAlumno.eliminar(alumno.id);

      await expect(repositorioAlumno.recuperar(alumno.id)).rejects.toThrowError(AlumnoNoEncontradoError);
    });

    test("deberia eliminar solo el alumno especificado cuando hay varios", async () => {
      const alumno1 = new Alumno("Juan", "Perez", "11111", "01/01/1990");
      const alumno2 = new Alumno("Ana", "Garcia", "22222", "02/02/1995");
      const alumno3 = new Alumno("Carlos", "Lopez", "33333", "03/03/1998");
      await repositorioAlumno.guardar(alumno1);
      await repositorioAlumno.guardar(alumno2);
      await repositorioAlumno.guardar(alumno3);

      await repositorioAlumno.eliminar(alumno2.id);

      await expect(repositorioAlumno.recuperar(alumno2.id)).rejects.toThrowError(AlumnoNoEncontradoError);
      await expect(repositorioAlumno.recuperar(alumno1.id)).resolves.not.toThrowError();
      await expect(repositorioAlumno.recuperar(alumno3.id)).resolves.not.toThrowError();
    });

    test("deberia arrojar AlumnoNoEncontradoError si el alumno no existe", async () => {
      await expect(repositorioAlumno.eliminar("99999")).rejects.toThrowError(AlumnoNoEncontradoError);
    });
  });
});
