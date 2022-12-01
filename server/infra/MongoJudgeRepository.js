module.exports = class MongoJudgeRepository {
  constructor(db) {
    this.db = db;
    this.collection = this.db.collection('judge');
  }
  async get(id) {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) {
      return;
    }
    const { _id, ...judge } = doc;
    return { ...judge, id: _id };
  }
  async list() {
    const cursor = this.collection.find();
    const docs = await cursor.toArray();
    return docs.map(({ _id: id, ...judge }) => ({ id, ...judge }));
  }
  async save(judge) {
    const { id: _id, ...doc } = judge;
    await this.collection.replaceOne({ _id }, doc, { upsert: true });
  }

  async clear() {
    await this.db.dropDatabase();
  }
};
