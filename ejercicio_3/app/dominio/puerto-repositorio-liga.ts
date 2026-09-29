import Liga from "../../app/dominio/liga";
import Posicion from "../../app/dominio/posicion";

export interface IRepositorioLiga {
  guardar(liga: Liga): Promise<void>;
  obtenerLiga(): Promise<Liga>;
  resetear(): Promise<void>;
  fabricarPosicion(tipoPosicion: string): Posicion;
}
