export default class Jugador {
  private potencialidad: number;
  constructor(potencialidad: number) {
    if (potencialidad > 5) {
      throw new Error("La potencialidad es invalida");
    }
    this.potencialidad = potencialidad;
  }
}
