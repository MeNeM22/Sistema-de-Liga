import Posicion, { Arquero, Defensor, Delantero, Mediocampista } from "./posicion";

export default class FabricaPosicion {
  public crear(posicion: string): Posicion {
    switch (posicion.toLowerCase()) {
      case "arquero":
        return new Arquero();

      case "defensor":
        return new Defensor();

      case "mediocampista":
        return new Mediocampista();

      case "delantero":
        return new Delantero();

      default:
        throw new Error(`Posición inválida: ${posicion}`);
    }
  }
}
