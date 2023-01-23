export class EventObserver<T> {
  observers: Array<(data: T) => void>;

  constructor() {
    this.observers = [];
  }

  subscribe(fn: (data: T) => void) {
    this.observers.push(fn);
  }

  unsubscribe(fn: () => void) {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  broadcast(data: T) {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}
