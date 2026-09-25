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

describe("Test Liga: Límite de presupuesto", () => {
  test("Debería lanzar un error al intentar inscribir un equipo cuando se alcanzo el limite de presupuesto", () => {
    const liga = new Liga();
    const equipo1 = new Equipo("River", 9000000);
    const equipo2 = new Equipo("Independiente", 999900);
    const equipo3 = new Equipo("Racing", 300);

    liga.registrarEquipo(equipo1);
    liga.registrarEquipo(equipo2);

    expect(() => {
      liga.registrarEquipo(equipo3);
    }).toThrow("La liga ya alcanzo el presupuesto maximo");
  });

  describe("Test Liga: Registro de equipos", () => {
    test("r4 - Error por equipos duplicados ignorando mayúsculas y minúsculas", () => {
      const liga = new Liga();
      const equipo1 = new Equipo("River", 300);
      const equipo2 = new Equipo("river", 300);

      liga.registrarEquipo(equipo1);
      expect(() => {
        liga.registrarEquipo(equipo2);
      }).toThrow("El equipo ya se encuentra registrado");
    });
  });
});
