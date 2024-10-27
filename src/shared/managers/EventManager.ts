type EventCallback = (event: Event) => void;

interface Listener {
  target: EventTarget;
  event: string;
  callback: EventCallback;
  options?: boolean | AddEventListenerOptions;
}

export class EventManager {
  private listeners: Record<string, Listener[]>;

  constructor() {
    this.listeners = {};
  }

  addListener(
    key: string,
    target: EventTarget,
    event: string,
    callback: EventCallback,
    options?: boolean | AddEventListenerOptions,
  ): void {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }

    const listener: Listener = { target, event, callback, options };
    this.listeners[key].push(listener);
    target.addEventListener(event, callback, options);
  }

  removeListenersByKey(key: string): void {
    if (!this.listeners[key]) return;

    this.listeners[key].forEach(({ target, event, callback, options }) => {
      target.removeEventListener(event, callback, options);
    });

    delete this.listeners[key];
  }

  clearAllListeners(): void {
    Object.keys(this.listeners).forEach((key) => {
      this.removeListenersByKey(key);
    });
  }
}
