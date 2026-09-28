import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const app = express();
const port = 3000;

app.use(express.json());

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
  res.status(200).json({
    nombre: "San Miguel",
    presupuesto: 10000,
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
