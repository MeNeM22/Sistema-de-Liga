import { app, server } from "../app/programa";
import supertest from "supertest";

const requestWithSupertest = supertest(app);

afterAll(() => {
  server.close();
});
describe("Calculadora", () => {
  it("GET /sumar dos numeros", async () => {
    const respuesta = await requestWithSupertest.get("/sumar?a=1&b=1");

    expect(respuesta.status).toEqual(200);
    expect(respuesta.body["resultado"]).toBe(2);
  });
});
