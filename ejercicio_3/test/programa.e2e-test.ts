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

    expect(respuesta.status).toEqual(201);
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

describe("POST /equipos/jugadores", () => {
  test("Deberia fichar un jugador en un equipo existente y devolver estado 201", async () => {
    const respuestaEquipo = await requestWithSupertest.post("/equipos").send({ nombre: "Racing", presupuesto: 500000 });

    const idEquipo = respuestaEquipo.body.id;

    const respuestaJugador = await requestWithSupertest.post(`/equipos/${idEquipo}/jugadores`).send({
      nombre: "leo perez",
      nacionalidad: "argentino",
      posicion: "defensor",
      valor_de_mercado: 100,
      potencialidad: 1,
    });

    expect(respuestaJugador.status).toEqual(201);
    expect(respuestaJugador.body.id).toBeDefined();
    expect(respuestaJugador.body.nombre).toEqual("leo perez");
    expect(respuestaJugador.body.nacionalidad).toEqual("argentino");
    expect(respuestaJugador.body.posicion).toEqual("defensor");
    expect(respuestaJugador.body.valor_de_mercado).toEqual(100);
    expect(respuestaJugador.body.potencialidad).toEqual(1);
  });
});
