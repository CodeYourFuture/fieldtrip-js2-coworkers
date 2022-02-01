import PQueue, { DefaultAddOptions } from "p-queue";

class QueueClass {
  _queue: any[];
  _deferredQ: Map<number, any>;
  _pointer: number;
  constructor() {
    this._queue = [];
    this._deferredQ = new Map();
    this._pointer = 0;
  }

  enqueue(run: (...args: any) => any, options: DefaultAddOptions | void) {
    if (!options || !options.priority) {
      this._queue.push(run);
      return;
    }
    if (options.priority === this._pointer) {
      this._queue.push(run);
      this._pointer++;
      if (this._deferredQ.has(this._pointer)) {
        const next = this._deferredQ.get(this._pointer);
        this._deferredQ.delete(this._pointer);
        this.enqueue(next, { priority: this._pointer }); //
      }
    } else {
      this._deferredQ.set(options.priority, run);
    }
  }

  dequeue() {
    return this._queue.shift();
  }

  get size() {
    return this._queue.length;
  }

  filter() {
    return this._queue;
  }
}

export const createOrderedQueue = () =>
  new PQueue({ queueClass: QueueClass, concurrency: 1 });
