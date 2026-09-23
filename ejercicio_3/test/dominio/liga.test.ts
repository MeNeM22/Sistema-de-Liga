import Liga from "../../app/dominio/liga";
import Equipo from "../../app/dominio/equipo";

describe("Test Liga: Límite de equipos", () => {
  test("Debería lanzar un error al intentar inscribir un equipo cuando ya hay 10 inscritos", () => {
    const liga = new Liga();
    for (let i = 0; i < 10; i++) {
      liga.registrarEquipo(new Equipo(`Equipo ${i}`, 1000000));
    }
    const equipoExtra = new Equipo("Equipo10", 1000000);
    expect(() => {
      liga.registrarEquipo(equipoExtra);
    }).toThrow("La liga ya tiene el cupo maximo de 10 equipos");
  });
});
