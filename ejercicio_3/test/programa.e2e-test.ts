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
  test("deberia devolver estado OK e incluir los datos del equipo creado en la respuesta", async () => {
    const respuesta = await requestWithSupertest.post("/equipos").send({ nombre: "San Miguel", presupuesto: 10000 });

    expect(respuesta.status).toEqual(200);
    expect(respuesta.body).toBeDefined();
    expect(respuesta.body.nombre).toEqual("San Miguel");
    expect(respuesta.body.presupuesto).toEqual(10000);
  });
});
