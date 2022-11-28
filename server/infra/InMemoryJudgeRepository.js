module.exports = class InMemoryJudgeRepository {
  #store = {};
  async list() {
    return Object.values(this.#store);
  }
  async get(id) {
    return this.#store[id];
  }
  async save(judge) {
    this.#store[judge.id] = judge;
  }
};
