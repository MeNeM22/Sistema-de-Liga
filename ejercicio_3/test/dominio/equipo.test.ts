import Equipo from "../../app/dominio/equipo";

describe("Test Equipo: Ingreso campos validos", () => {
  test("Deberia devolver un equipo estanciado con 0 jugadores y su presupuesto inicial", () => {
    const nombre = "Barcelona fc";
    const presupuesto = 10000;
    const equipo = new Equipo(nombre, presupuesto);
    expect(equipo.getNombreEquipo()).toBe("Barcelona fc");
    expect(equipo.getPlantilla().length).toBe(0);
    expect(equipo.getPresupuesto()).toBe(10000);
  });
});
