import Jugador from "../../app/dominio/jugador";

describe("Test Jugador: Ingreso valores invalidos", () => {
  test("Deberia devolver un error al ingresar una potencialidad mayor a 5", () => {
    expect(() => {
      new Jugador(6);
    }).toThrow("La potencialidad es invalida");
  });
});
