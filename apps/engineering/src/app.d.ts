declare global {
  namespace App {}

  interface Window {
    ym?: (counterId: number, method: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}

export {};
