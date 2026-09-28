import Liga from "../../app/dominio/liga";
import Equipo from "../../app/dominio/equipo";
import Jugador from "../../app/dominio/jugador";
import { Delantero, Defensor, Mediocampista, Arquero } from "../../app/dominio/posicion";

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
    const racing = new Equipo("Racing", 100000);

    const lautaro = new Jugador("Lautaro Martinez", 1200, "Argentina", 5, new Delantero());
    const dibu = new Jugador("Dibu Martinez", 1000, "Argentina", 5, new Arquero());
    const cuti = new Jugador("Cuti Romero", 800, "Argentina", 4, new Defensor());
    const macAllister = new Jugador("Alexis Mac Allister", 900, "Argentina", 4, new Mediocampista());

    racing.ficharJugador(lautaro);
    racing.ficharJugador(dibu);
    racing.ficharJugador(cuti);
    racing.ficharJugador(macAllister);
    liga.registrarEquipo(racing);

    await repositorio.guardar(liga);

    const ligaRecuperada = await repositorio.obtenerLiga();
    const equipoRecuperado = ligaRecuperada.getEquipo("Racing");

    expect(equipoRecuperado).toBeDefined();
    expect(equipoRecuperado?.getCantidadDeJugadores()).toBe(4);

    const plantilla = equipoRecuperado?.getPlantilla();
    expect(plantilla).toBeDefined();

    const delanteroRecuperado = plantilla?.find((j) => j.getNombre() === "Lautaro Martinez");
    expect(delanteroRecuperado).toBeDefined();
    expect(delanteroRecuperado?.getValorMercado()).toBe(1200);
    expect(delanteroRecuperado?.getPosicion() instanceof Delantero).toBe(true);
    expect(delanteroRecuperado?.getPosicion().esArquero()).toBe(false);

    const arqueroRecuperado = plantilla?.find((j) => j.getNombre() === "Dibu Martinez");
    expect(arqueroRecuperado).toBeDefined();
    expect(arqueroRecuperado?.getValorMercado()).toBe(1000);
    expect(arqueroRecuperado?.getPosicion() instanceof Arquero).toBe(true);
    expect(arqueroRecuperado?.getPosicion().esArquero()).toBe(true);

    const defensorRecuperado = plantilla?.find((j) => j.getNombre() === "Cuti Romero");
    expect(defensorRecuperado).toBeDefined();
    expect(defensorRecuperado?.getValorMercado()).toBe(800);
    expect(defensorRecuperado?.getPosicion() instanceof Defensor).toBe(true);

    const medioCampistaRecuperado = plantilla?.find((j) => j.getNombre() === "Alexis Mac Allister");
    expect(medioCampistaRecuperado).toBeDefined();
    expect(medioCampistaRecuperado?.getValorMercado()).toBe(900);
    expect(medioCampistaRecuperado?.getPosicion() instanceof Mediocampista).toBe(true);
  });
});
