export class EventManager {
  constructor() {
    this.listeners = {};
  }

  addListener(key, target, event, callback, options) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    const listener = { target, event, callback, options };
    this.listeners[key].push(listener);
    target.addEventListener(event, callback, options);
  }

  removeListenersByKey(key) {
    if (!this.listeners[key]) return;

    this.listeners[key].forEach(({ target, event, callback, options }) => {
      target.removeEventListener(event, callback, options);
    });

    delete this.listeners[key];
  }

  clearAllListeners() {
    Object.keys(this.listeners).forEach((key) => {
      this.removeListenersByKey(key);
    });
  }
}
