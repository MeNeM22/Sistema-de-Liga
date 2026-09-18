import Alumno from "./dominio/alumno";
import AlumnoNoEncontradoError from "../app/dominio/alumno-no-encontrado-error";
import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import PadronDeAlumnoInvalido from "../app/dominio/padron-de-alumno-invalido";
import SistemaAlumnos from "./dominio/sistema-alumnos";
import RepositorioAlumno from "./adaptadores/repositorio-alumno";

const app = express();
const port = 3000;

app.use(express.json());

const sistemaAlumnos = new SistemaAlumnos(new RepositorioAlumno());

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

app.get("/alumnos", async (req: Request, res: Response) => {
  let alumnos: Array<Alumno> = [];
  if (req.query.padron) {
    alumnos = alumnos.concat(await sistemaAlumnos.obtenerAlumnoPorPadron(req.query.padron));
  } else {
    alumnos = alumnos.concat(await sistemaAlumnos.obtenerAlumnos());
  }
  res.json(alumnos);
});

app.get("/alumnos/:id", async (req: Request, res: Response) => {
  try {
    const alumno = await sistemaAlumnos.obtenerAlumno(req.params.id);
    res.json(alumno);
  } catch (error: any) {
    if (error instanceof AlumnoNoEncontradoError) {
      res.status(404).json({
        error: `No se encontró el alumno con padrón ${req.params.padron}`,
      });
    } else {
      res.status(500);
    }
  }
});

app.post("/alumnos", async (req: Request, res: Response) => {
  try {
    const alumnoCreado: Alumno = await sistemaAlumnos.crearAlumno(
      req.body.padron,
      req.body.nombre,
      req.body.apellido,
      req.body.fechaNacimiento,
    );

    res.json(alumnoCreado);
  } catch (error: any) {
    if (error instanceof PadronDeAlumnoInvalido) {
      res.status(400).json({
        error: "El campo padron es obligatorio",
      });
    } else {
      res.status(500);
    }
  }
});

const server = app
  .listen(port, () => {
    console.log("El servidor está corriendo en el puerto: ", port);
  })
  .on("error", (error) => {
    console.log("Error: ", error.message);
  });

export { app, server };
