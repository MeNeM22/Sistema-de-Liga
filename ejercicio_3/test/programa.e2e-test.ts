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

describe("POST /equipos", () => {
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

describe("POST /equipos/:id_equipo/jugadores", () => {
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

  test("Deberia devolver un estado 400 y un mensaje de error si se excede la capacidad maxima de plantilla", async () => {
    const respuestaEquipo = await requestWithSupertest.post("/equipos").send({ nombre: "Racing", presupuesto: 500000 });

    const idEquipo = respuestaEquipo.body.id;
    const CAPACIDAD_MAX = 32;

    for (let i = 0; i < CAPACIDAD_MAX; i++) {
      await requestWithSupertest.post(`/equipos/${idEquipo}/jugadores`).send({
        nombre: `Delantero ${i}`,
        nacionalidad: "argentino",
        posicion: "delantero",
        valor_de_mercado: 10,
        potencialidad: 5,
      });
    }

    const respuestaExceso = await requestWithSupertest.post(`/equipos/${idEquipo}/jugadores`).send({
      nombre: "jugador extra",
      nacionalidad: "argentino",
      posicion: "arquero",
      valor_de_mercado: 10,
      potencialidad: 1,
    });
    expect(respuestaExceso.status).toEqual(400);
    expect(respuestaExceso.body.error).toBeDefined();
  });
});

describe("GET /equipos", () => {
  test("Deberia listar los equipos con su presupuesto_ejecutado y estado", async () => {
    const resEquipo = await requestWithSupertest.post("/equipos").send({ nombre: "san miguel", presupuesto: 10000 });

    const idEquipo = resEquipo.body.id;

    await requestWithSupertest.post(`/equipos/${idEquipo}/jugadores`).send({
      nombre: "leo perez",
      nacionalidad: "argentino",
      posicion: "defensor",
      valor_de_mercado: 2000,
      potencialidad: 1,
    });

    const respuesta = await requestWithSupertest.get("/equipos");

    expect(respuesta.status).toEqual(200);
    expect(Array.isArray(respuesta.body)).toBe(true);

    const equipo = respuesta.body.find((e: any) => e.id === idEquipo);

    expect(equipo).toBeDefined();
    expect(equipo.nombre).toEqual("san miguel");
    expect(equipo.presupuesto).toEqual(10000);
    expect(equipo.presupuesto_ejecutado).toEqual(2200);
    expect(equipo.estado).toEqual("INCOMPLETO");
  });

  test("Escenario l4: Consulta de equipo con estado completo (Racing)", async () => {
    const resEquipo = await requestWithSupertest.post("/equipos").send({ nombre: "Racing", presupuesto: 1000 });
    const idEquipo = resEquipo.body.id;

    for (let i = 0; i < 2; i++) {
      await requestWithSupertest.post(`/equipos/${idEquipo}/jugadores`).send({
        nombre: `Arquero ${i}`,
        nacionalidad: "argentino",
        posicion: "arquero",
        valor_de_mercado: 10,
        potencialidad: 5,
      });
    }

    for (let i = 0; i < 30; i++) {
      await requestWithSupertest.post(`/equipos/${idEquipo}/jugadores`).send({
        nombre: `Delantero ${i}`,
        nacionalidad: "argentino",
        posicion: "delantero",
        valor_de_mercado: 10,
        potencialidad: 5,
      });
    }

    const respuesta = await requestWithSupertest.get("/equipos");

    expect(respuesta.status).toEqual(200);

    const equipoRacing = respuesta.body.find((e: any) => e.id === idEquipo);

    expect(equipoRacing).toBeDefined();
    expect(equipoRacing.nombre).toEqual("Racing");
    expect(equipoRacing.estado).toEqual("COMPLETO");
  });
});

describe("GET /equipos/:id", () => {
  test("Deberia consultar un equipo especifico con su plantilla y poderes calculados", async () => {
    const resEquipo = await requestWithSupertest.post("/equipos").send({ nombre: "Los Malos", presupuesto: 34000 });
    const idEquipo = resEquipo.body.id;

    for (let i = 0; i < 2; i++) {
      await requestWithSupertest.post(`/equipos/${idEquipo}/jugadores`).send({
        nombre: `Arquero ${i}`,
        nacionalidad: "argentino",
        posicion: "arquero",
        valor_de_mercado: 10,
        potencialidad: 0,
      });
    }

    for (let i = 0; i < 30; i++) {
      await requestWithSupertest.post(`/equipos/${idEquipo}/jugadores`).send({
        nombre: `Delantero ${i}`,
        nacionalidad: "argentino",
        posicion: "delantero",
        valor_de_mercado: 10,
        potencialidad: 0,
      });
    }

    const respuesta = await requestWithSupertest.get(`/equipos/${idEquipo}`);

    expect(respuesta.status).toEqual(200);
    expect(respuesta.body.id).toEqual(idEquipo);
    expect(respuesta.body.nombre).toEqual("Los Malos");
    expect(respuesta.body.estado).toEqual("COMPLETO");
    expect(Array.isArray(respuesta.body.jugadores)).toBe(true);
    expect(respuesta.body.jugadores.length).toEqual(32);
    expect(respuesta.body.poder_ofensivo).toEqual(30);
    expect(respuesta.body.poder_defensivo).toEqual(2);
  });
});

describe("POST /reset", () => {
  test("Deberia reiniciar el sistema a cero y devolver resultado ok", async () => {
    await requestWithSupertest.post("/equipos").send({ nombre: "Boca Juniors", presupuesto: 10000 });

    const respuestaReset = await requestWithSupertest.post("/reset");

    expect(respuestaReset.status).toEqual(200);
    expect(respuestaReset.body.resultado).toEqual("ok");

    const respuestaEquipos = await requestWithSupertest.get("/equipos");

    expect(respuestaEquipos.status).toEqual(200);
    expect(respuestaEquipos.body.length).toEqual(0);
  });
});
