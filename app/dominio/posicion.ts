export default interface Posicion {
  poderOfensivoBase(): number;
  poderDefensivoBase(): number;
  esArquero(): boolean;
  nombre(): string;
}

export class Delantero implements Posicion {
  poderOfensivoBase(): number {
    return 1;
  }
  poderDefensivoBase(): number {
    return 0;
  }
  esArquero(): boolean {
    return false;
  }
  nombre(): string {
    return "delantero";
  }
}

export class Defensor implements Posicion {
  poderOfensivoBase(): number {
    return 0;
  }
  poderDefensivoBase(): number {
    return 1;
  }
  esArquero(): boolean {
    return false;
  }
  nombre(): string {
    return "defensor";
  }
}

export class Mediocampista implements Posicion {
  poderOfensivoBase(): number {
    return 0.5;
  }
  poderDefensivoBase(): number {
    return 0.5;
  }
  esArquero(): boolean {
    return false;
  }
  nombre(): string {
    return "mediocampista";
  }
}

export class Arquero implements Posicion {
  poderOfensivoBase(): number {
    return 0;
  }
  poderDefensivoBase(): number {
    return 1;
  }
  esArquero(): boolean {
    return true;
  }
  nombre(): string {
    return "arquero";
  }
}
