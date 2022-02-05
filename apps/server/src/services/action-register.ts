import EventEmitter from "eventemitter3";

export const emitter = new EventEmitter();

type Fn = (...args: unknown[]) => unknown;

class Register {
  set: Set<string>;
  subscribers: Fn[];

  constructor() {
    this.set = new Set();
    this.subscribers = [];
  }

  async flushed(fn: Fn) {
    if (this.set.size === 0) {
      await fn();
    } else {
      return new Promise((resolve) => {
        emitter.addListener("flush", async () => {
          const res = await fn();
          resolve(res);
        });
      });
    }
  }

  async process<T extends Fn>(fn: T) {
    const fnKey = fn.toString();
    this.set.add(fnKey);
    await fn();
    this.set.delete(fnKey);
    if (this.set.size === 0) {
      emitter.emit("flush");
    }
  }
}

export const actionRegister = new Register();
