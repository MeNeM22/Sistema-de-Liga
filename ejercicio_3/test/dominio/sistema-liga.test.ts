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
});
