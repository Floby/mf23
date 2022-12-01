const { MongoClient } = require('mongodb');
const MongoJudgeRepository = require('./infra/MongoJudgeRepository');
const InMemoryJudgeRepository = require('./infra/InMemoryJudgeRepository');

module.exports = function createContainer(ENV) {
  const judgeRepository = createJudgeRepository(ENV);
  return {
    repository: {
      judge: judgeRepository,
    },
  };
};

function createJudgeRepository(ENV) {
  if (ENV.MONGO_URL) {
    const client = new MongoClient(ENV.MONGO_URL);
    return new MongoJudgeRepository(client.db());
  } else {
    return new InMemoryJudgeRepository();
  }
}
