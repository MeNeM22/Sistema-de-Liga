import Liga from "../../app/dominio/liga";
import Equipo from "../../app/dominio/equipo";
import Jugador from "../../app/dominio/jugador";
import { Delantero } from "../../app/dominio/posicion";

import RepositorioLiga from "../../app/adaptadores/repositorio-liga";
import clienteRedis from "../../app/adaptadores/cliente-redis";

describe("RepositorioLiga", () => {
  afterEach(async () => {
    await clienteRedis((cliente) => cliente.flushDb());
  });

  const repositorio = new RepositorioLiga();

  test("Deberia guardar el estado de la liga y recuperarlo intacto desde Redis", async () => {
    const ligaArgentina = new Liga();
    const racing = new Equipo("Racing", 1000);
    ligaArgentina.registrarEquipo(racing);

    await repositorio.guardar(ligaArgentina);
    const ligaRecuperada = await repositorio.obtenerLiga();

    const equipoRecuperado = ligaRecuperada.getEquipo("Racing");
    expect(equipoRecuperado).toBeDefined();
    expect(equipoRecuperado?.getNombreEquipo()).toBe("Racing");
    expect(equipoRecuperado?.getPresupuesto()).toBe(1000);
  });

  test("Deberia conservar los jugadores de un equipo al recuperar la liga", async () => {
    const liga = new Liga();
    const racing = new Equipo("Racing", 1000);

    const jugador = new Jugador("Juan Perez", 100, "Argentina", 3, new Delantero());

    racing.ficharJugador(jugador);
    liga.registrarEquipo(racing);

    await repositorio.guardar(liga);

    const ligaRecuperada = await repositorio.obtenerLiga();
    const equipoRecuperado = ligaRecuperada.getEquipo("Racing");

    expect(equipoRecuperado).toBeDefined();
    expect(equipoRecuperado?.getCantidadDeJugadores()).toBe(1);
  });
});
