import { Calculadora } from "./calculadora";
import express, { Request, Response } from "express";
const app = express();
const port = 3000;

app.get("/sumar", (req: Request, res: Response) => {
  const a = parseInt(req.query["a"]);
  const b = parseInt(req.query["b"]);
  const calc = new Calculadora();
  const r = calc.sumar(a, b);
  res.send({ resultado: r });
});

const server = app
  .listen(port, () => {
    console.log("Server running at PORT: ", port);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });

export { app, server };
