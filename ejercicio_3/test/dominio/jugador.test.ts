import Jugador from "../../app/dominio/jugador";

describe("Test Jugador: Ingreso valores invalidos", () => {
  const valorMercado = 1000;
  const nacionalidad = "Argentina";
  const posicion = "Delantero";

  test("Deberia devolver un error al ingresar una potencialidad mayor a 5", () => {
    const potencialidad = 6;
    expect(() => {
      new Jugador(valorMercado, nacionalidad, potencialidad, posicion);
    }).toThrow("La potencialidad es invalida");
  });

  test("Deberia devolver un error al ingresar una potencialidad menor a 0", () => {
    const potencialidad = -1;
    expect(() => {
      new Jugador(valorMercado, nacionalidad, potencialidad, posicion);
    }).toThrow("La potencialidad es invalida");
  });
});

describe("Test Jugador: Ingreso valores validos", () => {
  const valorMercado = 1000;
  const nacionalidad = "Argentina";
  const potencialidad = 2;
  const posicion = "Defensor";

  test("Deberia devolver cada campo instanciado del jugador", () => {
    const jugador = new Jugador(valorMercado, nacionalidad, potencialidad, posicion);
    expect(jugador.getValorMercado()).toBe(1000);
    expect(jugador.getNacionalidad()).toBe("Argentina");
    expect(jugador.getPotencialidad()).toBe(2);
    expect(jugador.getPosicion()).toBe("Defensor");
  });

  test("Deberia devolver el poder ofensivo del jugador", () => {
    const jugador = new Jugador(valorMercado, nacionalidad, potencialidad, posicion);
    expect(jugador.calcularPoderOfensivo()).toBe(2);
  });

  test("Deberia devolver el poder defensivo del jugador", () => {
    const jugador = new Jugador(valorMercado, nacionalidad, potencialidad, posicion);
    expect(jugador.calcularPoderDefensivo()).toBe(-2);
  });
});
