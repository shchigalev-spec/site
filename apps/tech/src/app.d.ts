declare global {
  namespace App {
    interface Locals {}
    interface PageData {}
    interface PageState {}
    interface Platform {}
  }

  interface Window {
    ym?: (...args: unknown[]) => void;
    Ya?: Record<string, unknown>;
  }
}

export {};
