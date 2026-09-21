import Jugador from "../../app/dominio/jugador";
import Equipo from "../../app/dominio/equipo";

describe("Test Equipo: Ingreso campos validos", () => {
  test("Deberia devolver un equipo estanciado con 0 jugadores y presupuesto 0", () => {
    const plantilla: Jugador[] = [];
    const equipo = new Equipo(plantilla);
    expect(equipo.getPlantilla().length).toBe(0);
    expect(equipo.calcularPresupuesto()).toBe(0);
  });
});
