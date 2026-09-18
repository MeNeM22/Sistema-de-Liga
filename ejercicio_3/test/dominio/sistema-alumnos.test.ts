import SistemaAlumnos from "../../app/dominio/sistema-alumnos";
import Alumno from "../../app/dominio/alumno";
import AlumnoNoEncontradoError from "../../app/dominio/alumno-no-encontrado-error";
import { IRepositorioAlumno } from "../../app/dominio/puerto-repositorio-alumno";
import { Mock, mock } from "ts-jest-mocker";

// Mock del repositorio
//jest.mock("../../app/adaptadores/repositorio-alumno");

describe("SistemaAlumnos", () => {
  let sistemaAlumnos: SistemaAlumnos;
  let mockRepositorioAlumno: Mock<IRepositorioAlumno>;

  beforeEach(() => {
    mockRepositorioAlumno = mock<IRepositorioAlumno>();
    sistemaAlumnos = new SistemaAlumnos(mockRepositorioAlumno);
  });

  describe("crearAlumno", () => {
    test("deberia crear un objeto Alumno y guardarlo en el repositorio", async () => {
      mockRepositorioAlumno.guardar.mockResolvedValue(true);

      const alumnoCreado = await sistemaAlumnos.crearAlumno("12345", "Juan", "Perez", "01/01/1990");

      expect(mockRepositorioAlumno.guardar).toHaveBeenCalledTimes(1);

      const alumnoGuardado = mockRepositorioAlumno.guardar.mock.calls[0][0];
      expect(alumnoGuardado.getNombre()).toEqual("Juan");
      expect(alumnoGuardado.getApellido()).toEqual("Perez");
      expect(alumnoGuardado.getPadron()).toEqual("12345");
      expect(alumnoGuardado.getFechaNacimiento()).toEqual("01/01/1990");

      expect(alumnoCreado.getNombre()).toEqual("Juan");
      expect(alumnoCreado.getApellido()).toEqual("Perez");
      expect(alumnoCreado.getPadron()).toEqual("12345");
      expect(alumnoCreado.getFechaNacimiento()).toEqual("01/01/1990");
    });
  });

  describe("obtenerAlumnos", () => {
    test("deberia devolver lista vacia si el repositorio devuelve una lista vacia", async () => {
      mockRepositorioAlumno.listarAlumnos.mockResolvedValue([]);

      const resultado = await sistemaAlumnos.obtenerAlumnos();

      expect(mockRepositorioAlumno.listarAlumnos).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual([]);
    });

    test("deberia devolver la lista de alumnos devuelta por el repositorio", async () => {
      const alumnosMock = [
        new Alumno("Juan", "Perez", "12345", "01/01/1990"),
        new Alumno("Ana", "Garcia", "67890", "15/05/1995"),
      ];
      mockRepositorioAlumno.listarAlumnos.mockResolvedValue(alumnosMock);

      const resultado = await sistemaAlumnos.obtenerAlumnos();

      expect(mockRepositorioAlumno.listarAlumnos).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(alumnosMock);
      expect(resultado).toHaveLength(2);
    });
  });

  describe("eliminarAlumno", () => {
    test("deberia eliminar el registro del alumno a traves del repositorio", async () => {
      mockRepositorioAlumno.eliminar.mockResolvedValue();

      await sistemaAlumnos.eliminarAlumno("12345");

      expect(mockRepositorioAlumno.eliminar).toHaveBeenCalledTimes(1);
      expect(mockRepositorioAlumno.eliminar).toHaveBeenCalledWith("12345");
    });

    test("deberia arrojar AlumnoNoEncontradoError si el alumno no existe", async () => {
      mockRepositorioAlumno.eliminar.mockRejectedValue(new AlumnoNoEncontradoError("99999"));

      await expect(sistemaAlumnos.eliminarAlumno("99999")).rejects.toThrow(AlumnoNoEncontradoError);

      expect(mockRepositorioAlumno.eliminar).toHaveBeenCalledTimes(1);
      expect(mockRepositorioAlumno.eliminar).toHaveBeenCalledWith("99999");
    });
  });
});
