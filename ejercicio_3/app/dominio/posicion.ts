export default interface Posicion {
  poderOfensivoBase(): number;
  poderDefensivoBase(): number;
  esArquero(): boolean;
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
}
