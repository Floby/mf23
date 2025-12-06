const { MongoClient } = require('mongodb');
const MongoJudgeRepository = require('./infra/MongoJudgeRepository');
const InMemoryJudgeRepository = require('./infra/InMemoryJudgeRepository');
const LocalFileJudgeRepository = require('./infra/LocalFileJudgeRepository');
const Identity = require('./identity');

module.exports = function createContainer(ENV) {
  const judgeRepository = createJudgeRepository(ENV);
  const identifyVerifier = createIdentityVerifier(ENV);
  return {
    service: {
      identity: identifyVerifier,
    },
    repository: {
      judge: judgeRepository,
    },
  };
};

function createJudgeRepository(ENV) {
  if (ENV.MONGO_URL) {
    const client = new MongoClient(ENV.MONGO_URL);
    return new MongoJudgeRepository(client.db());
  } else if (ENV.JUDGE_FILE_PATH) {
    return new LocalFileJudgeRepository(ENV.JUDGE_FILE_PATH);
  } else {
    return new InMemoryJudgeRepository();
  }
}

function createIdentityVerifier(ENV) {
  const issuer = `https://${ENV.AUTH0_DOMAIN}/`;
  return new Identity(issuer);
}
