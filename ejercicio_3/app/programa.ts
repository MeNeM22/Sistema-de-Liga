import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import SistemaLiga from "./dominio/sistema-liga";
import RepositorioLiga from "./adaptadores/repositorio-liga";

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
    const nuevoEquipo = await sistemaLiga.registrarEquipo(req.body.nombre, req.body.presupuesto);
    res.status(200).json({
      nombre: nuevoEquipo.getNombreEquipo(),
      presupuesto: nuevoEquipo.getPresupuesto(),
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
});

app.post("/equipos/jugadores", async (req: Request, res: Response) => {
  res.status(200).json({
    nombre: "Diego Milito",
    valor: 15000,
    nacionalidad: "Argentina",
  });
});

const server = app
  .listen(port, () => {
    console.log("El servidor está corriendo en el puerto: ", port);
  })
  .on("error", (error) => {
    console.log("Error: ", error.message);
  });

export { app, server };
