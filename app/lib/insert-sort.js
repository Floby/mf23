export class InsertSort {
  #root = null;
  constructor(compare) {
    this.compare = compare;
  }

  push(value) {
    if (!this.#root) {
      this.#root = { value };
      return;
    }
    let current = this.#root;
    let i = 0;
    while (current) {
      if (++i > 30) {
        throw Error('OOPS');
      }
      if (this.compare(value, current.value) < 0) {
        if (current.lt) {
          current = current.lt;
        } else {
          current.lt = { value };
          return;
        }
      } else {
        if (current.gt) {
          current = current.gt;
        } else {
          current.gt = { value };
          return;
        }
      }
    }
  }

  [Symbol.iterator]() {
    return this.#explore(this.#root);
  }

  *#explore(node) {
    if (!node) {
      return;
    }
    yield* this.#explore(node.lt);
    yield node.value;
    yield* this.#explore(node.gt);
  }
}
