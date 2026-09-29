import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import SistemaLiga from "./dominio/sistema-liga";
import RepositorioLiga from "./adaptadores/repositorio-liga";
import { Arquero, Defensor, Mediocampista, Delantero } from "./dominio/posicion";

const app = express();
const port = 3000;

app.use(express.json());

const sistemaLiga = new SistemaLiga(new RepositorioLiga());

// Endpoint raíz: devuelve la versión del package.json
app.get("/", (_req: Request, res: Response) => {
  try {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const pkgContent = fs.readFileSync(pkgPath, { encoding: "utf8" });
    const pkg = JSON.parse(pkgContent) as { version?: string };
    res.json({ version: pkg.version ?? "unknown" });
  } catch (e) {
    res.status(500).json({ error: `No se pudo leer la versión: ${e}` });
  }
});

app.get("/", async (req: Request, res: Response) => {
  res.json({});
});

app.post("/equipos", async (req: Request, res: Response) => {
  try {
    const respuesta = await sistemaLiga.registrarEquipo(req.body.nombre, req.body.presupuesto);
    res.status(201).json({
      id: respuesta.getId(),
      nombre: respuesta.getNombreEquipo(),
      presupuesto: respuesta.getPresupuesto(),
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
});

app.post("/equipos/:id_equipo/jugadores", async (req: Request, res: Response) => {
  try {
    const idEquipo = req.params.id_equipo;
    const { nombre, valor_de_mercado, nacionalidad, potencialidad, posicion } = req.body;

    const resultado = await sistemaLiga.ficharJugadorPorIdEquipo(
      idEquipo,
      nombre,
      valor_de_mercado,
      nacionalidad,
      potencialidad,
      posicion,
    );

    const objetoPosicion = resultado.getPosicion();
    let stringPosicion = "";

    if (objetoPosicion instanceof Arquero) {
      stringPosicion = "arquero";
    } else if (objetoPosicion instanceof Defensor) {
      stringPosicion = "defensor";
    } else if (objetoPosicion instanceof Mediocampista) {
      stringPosicion = "mediocampista";
    } else if (objetoPosicion instanceof Delantero) {
      stringPosicion = "delantero";
    }

    res.status(201).json({
      id: resultado.getId(),
      nombre: resultado.getNombre(),
      nacionalidad: resultado.getNacionalidad(),
      posicion: stringPosicion,
      valor_de_mercado: resultado.getValorMercado(),
      potencialidad: resultado.getPotencialidad(),
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
});

app.get("/equipos", async (req: Request, res: Response) => {
  const listaEquipos = await sistemaLiga.listarEquipos();

  res.status(200).json(listaEquipos);
});

app.get("/equipos/:id_equipo", async (req: Request, res: Response) => {
  try {
    const idEquipo = req.params.id_equipo;
    const dtoEquipo = await sistemaLiga.consultarEquipo(idEquipo);

    res.status(200).json(dtoEquipo);
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
});

app.post("/reset", async (req: Request, res: Response) => {
  await sistemaLiga.resetearSistema();

  res.status(200).json({ resultado: "ok" });
});

const server = app
  .listen(port, () => {
    console.log("El servidor está corriendo en el puerto: ", port);
  })
  .on("error", (error) => {
    console.log("Error: ", error.message);
  });

export { app, server };
