import Equipo from "../../app/dominio/equipo";
import Jugador from "../../app/dominio/jugador";

describe("Test Equipo: Ingreso campos validos", () => {
  const nombre = "Barcelona fc";
  const presupuesto = 10000;
  let equipo: Equipo;
  let jugador1: Jugador;
  let jugador2: Jugador;
  let jugador3: Jugador;

  beforeEach(() => {
    equipo = new Equipo(nombre, presupuesto);
    jugador1 = new Jugador(2000, "Argentina", 5, "Delantero");
    jugador2 = new Jugador(1500, "Brasil", 4, "Mediocampista");
    jugador3 = new Jugador(1000, "Uruguay", 3, "Defensor");
  });

  test("Deberia devolver un equipo estanciado con su nombre, 0 jugadores y su presupuesto inicial", () => {
    expect(equipo.getNombreEquipo()).toBe("Barcelona fc");
    expect(equipo.getPlantilla().length).toBe(0);
    expect(equipo.getPresupuesto()).toBe(10000);
  });
  test("Deberia devolver un equipo con una plantilla de 3 jugadores", () => {
    equipo.ficharJugador(jugador1);
    equipo.ficharJugador(jugador2);
    equipo.ficharJugador(jugador3);

    expect(equipo.getNombreEquipo()).toBe("Barcelona fc");
    expect(equipo.getPlantilla().length).toBe(3);
    expect(equipo.getPresupuesto()).toBe(10000);
  });
  test("Deberia calcular correctamente el poder ofensivo", () => {
    equipo.ficharJugador(jugador1);
    equipo.ficharJugador(jugador2);
    equipo.ficharJugador(jugador3);
    expect(equipo.calcularPoderOfensivo()).toBe(9);
  });
});

describe("Test Equipo: Limite de plantilla", () => {
  test("Deberia devolver un error al intentar fichar un jugador si la plantilla tiene 32 jugadores", () => {
    const nombre = "Real Madrid";
    const presupuesto = 10000;
    const equipo = new Equipo(nombre, presupuesto);

    const jugador = new Jugador(1000, "Argentina", 3, "Defensor");

    for (let i = 0; i < 32; i++) {
      equipo.ficharJugador(jugador);
    }

    const jugadorExtra = new Jugador(2000, "Brasil", 5, "Delantero");

    expect(() => {
      equipo.ficharJugador(jugadorExtra);
    }).toThrow("La plantilla ya esta completa");
  });
});
