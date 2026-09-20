export default class Jugador {
  private potencialidad: number;
  constructor(potencialidad: number) {
    if (potencialidad < 0 || potencialidad > 5) {
      throw new Error("La potencialidad es invalida");
    }
    this.potencialidad = potencialidad;
  }
}
