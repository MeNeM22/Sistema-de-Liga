import SistemaLiga from "../../app/dominio/sistema-liga";
import Liga from "../../app/dominio/liga";
import Equipo from "../../app/dominio/equipo";
import { IRepositorioLiga } from "../../app/dominio/puerto-repositorio-liga";
import { Mock, mock } from "ts-jest-mocker";

describe("SistemaLiga", () => {
  let sistemaLiga: SistemaLiga;
  let mockRepositorioLiga: Mock<IRepositorioLiga>;

  beforeEach(() => {
    mockRepositorioLiga = mock<IRepositorioLiga>();
    sistemaLiga = new SistemaLiga(mockRepositorioLiga);
  });

  describe("registrarEquipo", () => {
    test("deberia crear un objeto Equipo, registrarlo en la liga y guardarlo en el repositorio", async () => {
      const ligaMock = new Liga();

      mockRepositorioLiga.obtenerLiga.mockResolvedValue(ligaMock);
      mockRepositorioLiga.guardar.mockResolvedValue();

      const equipoCreado = await sistemaLiga.registrarEquipo("San Miguel", 10000);

      expect(mockRepositorioLiga.obtenerLiga).toHaveBeenCalledTimes(1);
      expect(mockRepositorioLiga.guardar).toHaveBeenCalledTimes(1);
      expect(equipoCreado.getNombreEquipo()).toEqual("San Miguel");
      expect(equipoCreado.getPresupuesto()).toEqual(10000);
      expect(ligaMock.obtenerEquipos()).toContain(equipoCreado);
    });
  });

  describe("ficharJugadorPorIdEquipo", () => {
    test("Deberia fabricar el jugador, agregarlo al equipo indicado y guardar los cambios", async () => {
      const ligaMock = new Liga();
      const equipoMock = new Equipo("River Plate", 5000);

      equipoMock.asignarId("eq-123");
      ligaMock.registrarEquipo(equipoMock);

      mockRepositorioLiga.obtenerLiga.mockResolvedValue(ligaMock);
      mockRepositorioLiga.guardar.mockResolvedValue();

      const jugadorFichado = await sistemaLiga.ficharJugadorPorIdEquipo(
        "eq-123",
        "Enzo Perez",
        100,
        "Argentina",
        4,
        "mediocampista",
      );

      expect(mockRepositorioLiga.obtenerLiga).toHaveBeenCalledTimes(1);
      expect(mockRepositorioLiga.guardar).toHaveBeenCalledTimes(1);
      expect(jugadorFichado.getNombre()).toEqual("Enzo Perez");
      expect(jugadorFichado.getPosicion().nombre()).toEqual("mediocampista");
      expect(equipoMock.getPlantilla()).toContain(jugadorFichado);
    });
  });

  describe("listarEquipos", () => {
    test("Deberia devolver un listado de equipos mapeados", async () => {
      const ligaMock = new Liga();
      const equipoMock = new Equipo("Boca Juniors", 1000);
      equipoMock.asignarId("eq-boca");
      ligaMock.registrarEquipo(equipoMock);

      mockRepositorioLiga.obtenerLiga.mockResolvedValue(ligaMock);

      const listado = await sistemaLiga.listarEquipos();

      expect(mockRepositorioLiga.obtenerLiga).toHaveBeenCalledTimes(1);
      expect(listado).toHaveLength(1);
      expect(listado[0]).toEqual({
        id: "eq-boca",
        nombre: "Boca Juniors",
        presupuesto: 1000,
        presupuesto_ejecutado: 0,
        estado: "INCOMPLETO",
      });
    });
  });

  describe("consultarEquipo", () => {
    test("Deberia devolver el detalle completo de un equipo y sus poderes calculados", async () => {
      const ligaMock = new Liga();
      const equipoMock = new Equipo("Racing Club", 2000);
      equipoMock.asignarId("eq-racing");
      ligaMock.registrarEquipo(equipoMock);

      mockRepositorioLiga.obtenerLiga.mockResolvedValue(ligaMock);

      const detalles = await sistemaLiga.consultarEquipo("eq-racing");

      expect(mockRepositorioLiga.obtenerLiga).toHaveBeenCalledTimes(1);
      expect(detalles.id).toEqual("eq-racing");
      expect(detalles.nombre).toEqual("Racing Club");
      expect(detalles.jugadores).toEqual([]);
      expect(detalles.poder_defensivo).toEqual(0);
      expect(detalles.poder_ofensivo).toEqual(0);
    });
  });
});
