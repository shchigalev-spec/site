declare global {
  namespace App {}

  interface Window {
    __A_MODUL_METRICA_ID__?: number;
    ym?: ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };
  }
}

export {};
