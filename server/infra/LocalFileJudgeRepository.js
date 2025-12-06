const fs = require('fs/promises');

module.exports = class LocalFileJudgeRepository {
  #path = '';

  constructor(path) {
    this.#path = path;
  }

  async list() {
    return await this.#getStore();
  }

  async save(judge) {
    const store = await this.#getStore();
    const index = store.findIndex((j) => j.id == judge.id);
    if (index >= 0) {
      store[index] = judge;
    } else {
      store.push(judge);
    }
    await this.#setStore(store);
  }
  async get(id) {
    const store = await this.#getStore();
    return store.find((j) => j.id == id);
  }

  async #getStore() {
    try {
      const content = await fs.readFile(this.#path, { encoding: 'utf8' });
      return JSON.parse(content);
    } catch {
      return [];
    }
  }
  async #setStore(store) {
    await fs.writeFile(this.#path, JSON.stringify(store, null, '  '), {
      encoding: 'utf8',
    });
  }

  async clear() {
    try {
      await fs.unlink(this.#path);
    } catch {
      return;
    }
  }
};
