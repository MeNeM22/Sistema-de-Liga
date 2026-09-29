import Jugador from "../../app/dominio/jugador";
import { Delantero, Defensor } from "../../app/dominio/posicion";

import JugadorPotencialidadInvalidaError from "../../app/dominio/clases-de-errores/jugador-potencialidad-invalida-error";
import JugadorValorMercadoNegativoError from "../../app/dominio/clases-de-errores/jugador-valor-mercado-negativo-error";

describe("Test Jugador: Ingreso valores invalidos", () => {
  const nombre = "Juan";
  const nacionalidad = "Argentina";
  const posicion = new Delantero();

  test("Deberia devolver un error al ingresar una potencialidad mayor a 5", () => {
    const potencialidad = 6;
    const valorMercado = 1000;
    expect(() => {
      new Jugador(nombre, valorMercado, nacionalidad, potencialidad, posicion);
    }).toThrow(JugadorPotencialidadInvalidaError);
  });

  test("Deberia devolver un error al ingresar una potencialidad menor a 0", () => {
    const potencialidad = -1;
    const valorMercado = 1000;
    expect(() => {
      new Jugador(nombre, valorMercado, nacionalidad, potencialidad, posicion);
    }).toThrow(JugadorPotencialidadInvalidaError);
  });

  test("Deberia devolver un error al ingresar un valor de mercado negativo", () => {
    const potencialidad = 2;
    const valorMercado = -1;
    expect(() => {
      new Jugador(nombre, valorMercado, nacionalidad, potencialidad, posicion);
    }).toThrow(JugadorValorMercadoNegativoError);
  });

  test("Deberia devolver un error al no ingresar un nombre", () => {
    const potencialidad = 2;
    const valorMercado = 1000;
    const nacionalidad = "Argentina";
    const posicion = new Defensor();

    expect(() => {
      new Jugador("", valorMercado, nacionalidad, potencialidad, posicion);
    }).toThrow("El nombre de jugador es invalido");
  });

  test("Deberia devolver un error al un numero como nombre", () => {
    const nombre: any = 20;
    const potencialidad = 2;
    const valorMercado = 1000;
    const nacionalidad = "Argentina";
    const posicion = new Defensor();

    expect(() => {
      new Jugador(nombre, valorMercado, nacionalidad, potencialidad, posicion);
    }).toThrow("El nombre de jugador es invalido");
  });
});

describe("Test Jugador: Ingreso valores validos", () => {
  const nombre = "Juan";
  const valorMercado = 1000;
  const nacionalidad = "Argentina";
  const potencialidad = 2;
  const posicion = new Defensor();

  test("Deberia devolver cada campo instanciado del jugador", () => {
    const jugador = new Jugador(nombre, valorMercado, nacionalidad, potencialidad, posicion);
    expect(jugador.getValorMercado()).toBe(1000);
    expect(jugador.getNacionalidad()).toBe("Argentina");
    expect(jugador.getPotencialidad()).toBe(2);
    expect(jugador.getPosicion()).toBeInstanceOf(Defensor);
  });

  test("Deberia devolver el poder ofensivo del jugador", () => {
    const jugador = new Jugador(nombre, valorMercado, nacionalidad, potencialidad, posicion);
    expect(jugador.calcularPoderOfensivo()).toBe(2);
  });

  test("Deberia devolver el poder defensivo del jugador", () => {
    const jugador = new Jugador(nombre, valorMercado, nacionalidad, potencialidad, posicion);
    expect(jugador.calcularPoderDefensivo()).toBe(-2);
  });
});
