import { describe, test, expect } from "@jest/globals";
import { Calculadora } from "../app/calculadora";

describe("calculadora", () => {
  test("test1", () => {
    const calculadora: Calculadora = new Calculadora();
    const resultado = calculadora.sumar(1, 1);
    expect(resultado).toBe(2);
  });
});
