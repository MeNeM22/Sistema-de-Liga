import Jugador from "../../app/dominio/jugador";

describe("Test Jugador: Ingreso valores invalidos", () => {
  const valorMercado = 1000;
  const nacionalidad = "Argentina";
  test("Deberia devolver un error al ingresar una potencialidad mayor a 5", () => {
    const potencialidad = 6;
    expect(() => {
      new Jugador(valorMercado, nacionalidad, potencialidad);
    }).toThrow("La potencialidad es invalida");
  });
  test("Deberia devolver un error al ingresar una potencialidad menor a 0", () => {
    const potencialidad = -1;
    expect(() => {
      new Jugador(valorMercado, nacionalidad, potencialidad);
    }).toThrow("La potencialidad es invalida");
  });
});

describe("Test Jugador: Ingreso valores validos", () => {
  test("Deberia devolver cada campo instanciado del jugador", () => {
    const valorMercado = 1000;
    const nacionalidad = "Argentina";
    const potencialidad = 2;
    const jugador = new Jugador(valorMercado, nacionalidad, potencialidad);
    expect(jugador.getValorMercado()).toBe(1000);
    expect(jugador.getNacionalidad()).toBe("Argentina");
    expect(jugador.getPotencialidad()).toBe(2);
  });
});
