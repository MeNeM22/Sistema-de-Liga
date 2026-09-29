import Liga from "../../app/dominio/liga";

export interface IRepositorioLiga {
  guardar(liga: Liga): Promise<void>;
  obtenerLiga(): Promise<Liga>;
  resetear(): Promise<void>;
}
