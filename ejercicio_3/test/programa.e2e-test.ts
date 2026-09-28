import { app, server } from "../app/programa";
import clienteRedis from "../app/adaptadores/cliente-redis";
import supertest from "supertest";

const requestWithSupertest = supertest(app);

afterEach(async () => {
  // Borrar todos los datos en Redis después de ejecutar cada prueba
  await clienteRedis((cliente) => cliente.flushDb());
});

afterAll(() => {
  server.close();
});

describe("POST /alumnos", () => {
  test("Deberia devolver estado OK e incluir los datos del equipo creado en la respuesta", async () => {
    const respuesta = await requestWithSupertest.post("/equipos").send({ nombre: "San Miguel", presupuesto: 10000 });

    expect(respuesta.status).toEqual(200);
    expect(respuesta.body).toBeDefined();
    expect(respuesta.body.nombre).toEqual("San Miguel");
    expect(respuesta.body.presupuesto).toEqual(10000);
  });

  test("Deberia devolver estado 400 y un mensaje de error si el presupuesto es invalido", async () => {
    const respuesta = await requestWithSupertest.post("/equipos").send({ nombre: "Independiente", presupuesto: -5000 });

    expect(respuesta.status).toEqual(400);
    expect(respuesta.body.error).toBeDefined();
  });
});
