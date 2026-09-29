import Liga from "../../app/dominio/liga";
import Jugador from "../../app/dominio/jugador";
import Equipo from "../../app/dominio/equipo";
import { Delantero, Defensor, Mediocampista, Arquero } from "../../app/dominio/posicion";

import EquipoPlantillaLlenaError from "../../app/dominio/clases-de-errores/equipo-plantilla-llena-error";
import EquipoPresupuestoExcedidoError from "../../app/dominio/clases-de-errores/equipo-presupuesto-excedido-error";
import EquipoCantidadArquerosExcedidoError from "../../app/dominio/clases-de-errores/equipo-cantidad-arqueros-excedido-error";
import EquipoPresupuestoInicialNegativoError from "../../app/dominio/clases-de-errores/equipo-presupuesto-inicial-negativo-error";
import EquipoNombreInvalidoError from "../../app/dominio/clases-de-errores/equipo-nombre-invalido-error";

describe("Test Equipo: Ingreso campos validos", () => {
  const nombre = "Barcelona fc";
  const presupuesto = 10000;
  let equipo: Equipo;
  let jugador1: Jugador;
  let jugador2: Jugador;
  let jugador3: Jugador;

  beforeEach(() => {
    equipo = new Equipo(nombre, presupuesto);
    jugador1 = new Jugador("Messi", 2000, "Argentina", 5, new Delantero());
    jugador2 = new Jugador("Neymar", 1500, "Brasil", 4, new Mediocampista());
    jugador3 = new Jugador("Suarez", 1000, "Uruguay", 3, new Defensor());
  });

  test("Deberia devolver un equipo estanciado con su nombre, 0 jugadores y su presupuesto inicial", () => {
    expect(equipo.getNombreEquipo()).toBe("Barcelona fc");
    expect(equipo.getCantidadDeJugadores()).toBe(0);
    expect(equipo.getPresupuesto()).toBe(10000);
  });

  test("Deberia devolver un equipo con una plantilla de 3 jugadores", () => {
    equipo.ficharJugador(jugador1);
    equipo.ficharJugador(jugador2);
    equipo.ficharJugador(jugador3);

    expect(equipo.getNombreEquipo()).toBe("Barcelona fc");
    expect(equipo.getCantidadDeJugadores()).toBe(3);
    expect(equipo.getPresupuesto()).toBe(10000);
  });
});

describe("Test Equipo: Ingreso campos invalidos", () => {
  test("Deberia lanzar un error si el nombre esta vacio", () => {
    const nombre: string = "";
    const presupuesto: number = 500;
    expect(() => {
      new Equipo(nombre, presupuesto);
    }).toThrow(EquipoNombreInvalidoError);
  });

  test("Deberia lanzar un error si el nombre es un numero", () => {
    const nombre: any = 23;
    const presupuesto: number = 500;
    expect(() => {
      new Equipo(nombre, presupuesto);
    }).toThrow(EquipoNombreInvalidoError);
  });

  test("Deberia devolver un error al intentar inicializar un equipo con presupuesto negativo", () => {
    const nombre = "Racing";
    const presupuesto = -100;

    expect(() => {
      new Equipo(nombre, presupuesto);
    }).toThrow(EquipoPresupuestoInicialNegativoError);
  });
});

describe("Test Equipo: escenarios de prueba de consulta_de_equipo", () => {
  test("altojardin1 - Consulta de equipo con 2 arqueros, 4 defensores, 3 mediocampistas y 3 delanteros", () => {
    const equipo = new Equipo("River", 10000000);

    for (let i: number = 0; i < 2; i++) {
      equipo.ficharJugador(new Jugador("Jugador", 1000, "Argentina", 3, new Arquero()));
    }

    for (let i: number = 0; i < 4; i++) {
      equipo.ficharJugador(new Jugador("Jugador", 1000, "Argentina", 3, new Defensor()));
    }

    for (let i: number = 0; i < 3; i++) {
      equipo.ficharJugador(new Jugador("Jugador", 1000, "Argentina", 3, new Mediocampista()));
    }

    for (let i: number = 0; i < 3; i++) {
      equipo.ficharJugador(new Jugador("Jugador", 1000, "Argentina", 3, new Delantero()));
    }

    const poderOfensivo: number = equipo.calcularPoderOfensivo();
    const poderDefensivo: number = equipo.calcularPoderDefensivo();

    expect(poderOfensivo).toBe(40);
    expect(poderDefensivo).toBe(43);
  });

  test("altojardin2 - Consulta de equipo con 2 arqueros, 5 defensores, 4 mediocampistas y 2 delanteros", () => {
    const equipo = new Equipo("Boca", 10000000);

    for (let i: number = 0; i < 2; i++) {
      equipo.ficharJugador(new Jugador("Jugador", 1000, "Argentina", 2, new Arquero()));
    }

    for (let i: number = 0; i < 5; i++) {
      equipo.ficharJugador(new Jugador("Jugador", 1000, "Argentina", 4, new Defensor()));
    }

    for (let i: number = 0; i < 4; i++) {
      equipo.ficharJugador(new Jugador("Jugador", 1000, "Argentina", 2, new Mediocampista()));
    }

    for (let i: number = 0; i < 2; i++) {
      equipo.ficharJugador(new Jugador("Jugador", 1000, "Argentina", 3, new Delantero()));
    }
    const poderOfensivo: number = equipo.calcularPoderOfensivo();
    const poderDefensivo: number = equipo.calcularPoderDefensivo();

    expect(poderOfensivo).toBe(42);
    expect(poderDefensivo).toBe(47);
  });
});

describe("Test Equipo: Limite de plantilla", () => {
  test("Deberia devolver un error al intentar fichar un jugador si la plantilla tiene 32 jugadores", () => {
    const nombre = "Real Madrid";
    const presupuesto = 100000;
    const equipo = new Equipo(nombre, presupuesto);

    const jugador = new Jugador("Jugador", 1000, "Argentina", 3, new Defensor());

    for (let i = 0; i < 32; i++) {
      equipo.ficharJugador(jugador);
    }

    const jugadorExtra = new Jugador("Jugador", 2000, "Brasil", 5, new Delantero());

    expect(() => {
      equipo.ficharJugador(jugadorExtra);
    }).toThrow(EquipoPlantillaLlenaError);
  });
});

describe("Test Equipo: presupuesto", () => {
  test("Deberia devolver un error al intentar fichar un jugador si excede el presupuesto del equipo", () => {
    const nombre = "Racing";
    const presupuesto = 100;
    const equipo = new Equipo(nombre, presupuesto);
    const jugador1 = new Jugador("Jugador", 80, "Argentina", 3, new Delantero());
    const jugador2 = new Jugador("Jugador", 30, "Brasil", 2, new Defensor());

    equipo.ficharJugador(jugador1);
    expect(() => {
      equipo.ficharJugador(jugador2);
    }).toThrow(EquipoPresupuestoExcedidoError);
  });
});

describe("Test Equipo: Limite de arqueros", () => {
  test("Deberia devolver un error al intentar fichar un arquero cuando ya hay 2 fichados", () => {
    const nombre = "Racing";
    const presupuesto = 200;
    const equipo = new Equipo(nombre, presupuesto);
    const jugador1 = new Jugador("Jugador", 80, "Argentina", 3, new Arquero());
    const jugador2 = new Jugador("Jugador", 30, "Brasil", 2, new Arquero());
    const jugador3 = new Jugador("Jugador", 30, "Chile", 2, new Arquero());

    equipo.ficharJugador(jugador1);
    equipo.ficharJugador(jugador2);

    expect(() => {
      equipo.ficharJugador(jugador3);
    }).toThrow(EquipoCantidadArquerosExcedidoError);
  });
});

describe("Test Equipo: Estados de la plantilla", () => {
  test("l2 - Consulta de equipo con estado INCOMPLETO", () => {
    const equipo = new Equipo("River", 100);

    expect(equipo.estaCompleto()).toBe(false);
  });

  test("l4 - Consulta de equipo con estado completo", () => {
    const liga = new Liga();
    const racing = new Equipo("Racing", 1000);

    for (let i: number = 0; i < 2; i++) {
      racing.ficharJugador(new Jugador("Arquero", 10, "Argentina", 5, new Arquero()));
    }

    for (let i: number = 0; i < 30; i++) {
      racing.ficharJugador(new Jugador("Delantero", 10, "Argentina", 5, new Delantero()));
    }

    liga.registrarEquipo(racing);

    const equipoEncontrado: Equipo | undefined = liga.getEquipo("Racing");

    expect(equipoEncontrado?.estaCompleto()).toBe(true);
  });
});
