import Calculadora from "./calculadora";

const calc = new Calculadora();

const a = parseInt(process.argv[2]);
const b = parseInt(process.argv[3]);

console.log(calc.sumar(a, b));
