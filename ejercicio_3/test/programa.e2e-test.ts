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
  test("deberia devolver estado OK e incluir los datos del alumno creado en la respuesta", async () => {
    const respuesta = await requestWithSupertest
      .post("/alumnos")
      .send({ padron: "11111", nombre: "Juana", apellido: "Lopez", fechaNacimiento: "01/01/2000" });

    expect(respuesta.status).toEqual(200);
    expect(respuesta.body).not.toBeNull();
    expect(respuesta.body.padron).toEqual("11111");
    expect(respuesta.body.nombre).toEqual("Juana");
    expect(respuesta.body.apellido).toEqual("Lopez");
    expect(respuesta.body.fechaNacimiento).toEqual("01/01/2000");
  });

  test("deberia devolver estado 400 y mensaje de error si no se incluye el campo padron", async () => {
    const respuesta = await requestWithSupertest
      .post("/alumnos")
      .send({ nombre: "Juana", apellido: "Lopez", fechaNacimiento: "01/01/2000" });

    expect(respuesta.status).toEqual(400);
  });
});

describe("GET /alumnos", () => {
  test("deberia devolver estado OK y una lista vacia si no hay alumnos guardados", async () => {
    const respuesta = await requestWithSupertest.get("/alumnos");

    expect(respuesta.status).toEqual(200);
    expect(respuesta.body).toEqual([]);
  });

  test("deberia devolver estado OK y una lista con un alumno si hay uno guardado", async () => {
    // Primero guardamos un alumno
    await requestWithSupertest
      .post("/alumnos")
      .send({ padron: "12345", nombre: "Ana", apellido: "Garcia", fechaNacimiento: "15/05/1995" });

    const respuesta = await requestWithSupertest.get("/alumnos");

    expect(respuesta.status).toEqual(200);
    expect(respuesta.body).toHaveLength(1);
    expect(respuesta.body[0].padron).toEqual("12345");
    expect(respuesta.body[0].nombre).toEqual("Ana");
    expect(respuesta.body[0].apellido).toEqual("Garcia");
    expect(respuesta.body[0].fechaNacimiento).toEqual("15/05/1995");
  });

  test("deberia devolver estado OK y una lista con todos los alumnos si hay varios guardados", async () => {
    // Guardamos varios alumnos
    await requestWithSupertest
      .post("/alumnos")
      .send({ padron: "11111", nombre: "Juana", apellido: "Lopez", fechaNacimiento: "01/01/2000" });

    await requestWithSupertest
      .post("/alumnos")
      .send({ padron: "22222", nombre: "Carlos", apellido: "Martinez", fechaNacimiento: "10/03/1998" });

    await requestWithSupertest
      .post("/alumnos")
      .send({ padron: "33333", nombre: "Sofia", apellido: "Rodriguez", fechaNacimiento: "25/07/1999" });

    const respuesta = await requestWithSupertest.get("/alumnos");

    expect(respuesta.status).toEqual(200);
    expect(respuesta.body).toHaveLength(3);

    const padrones = respuesta.body.map((alumno: any) => alumno.padron);
    expect(padrones).toContain("11111");
    expect(padrones).toContain("22222");
    expect(padrones).toContain("33333");

    const nombres = respuesta.body.map((alumno: any) => alumno.nombre);
    expect(nombres).toContain("Juana");
    expect(nombres).toContain("Carlos");
    expect(nombres).toContain("Sofia");
  });
});

describe("GET /alumnos/:id", () => {
  test("deberia devolver estado OK y los datos del alumno si existe", async () => {
    // Primero guardamos un alumno
    const primeraRespuesta = await requestWithSupertest
      .post("/alumnos")
      .send({ padron: "12345", nombre: "Ana", apellido: "Garcia", fechaNacimiento: "15/05/1995" });

    const id = primeraRespuesta.body["id"];
    const respuesta = await requestWithSupertest.get(`/alumnos/${id}`);

    expect(respuesta.status).toEqual(200);
    expect(respuesta.body).not.toBeNull();
    expect(respuesta.body.padron).toEqual("12345");
    expect(respuesta.body.nombre).toEqual("Ana");
    expect(respuesta.body.apellido).toEqual("Garcia");
    expect(respuesta.body.fechaNacimiento).toEqual("15/05/1995");
  });
});
