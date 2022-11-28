/* eslint-env node, mocha */
const InMemoryJudgeRepository = require('../../server/infra/InMemoryJudgeRepository');
const { expect } = require('chai');

describe('JudgeRepository', () => {
  const id = 'FTYHJNBVG';
  const judge = {
    id,
    name: 'Floby',
    miss: {
      charente: {
        mention: 4,
        comment: 'Bien mais pas top',
      },
    },
  };
  let repo;
  beforeEach(() => {
    repo = new InMemoryJudgeRepository();
  });
  context('when there are no contents', () => {
    describe('.list()', () => {
      it('resolves an empty array', async () => {
        // Given
        // When
        const actual = await repo.list();
        // Then
        expect(actual).to.deep.equal([]);
      });
    });
    describe('.get(id)', () => {
      it('resolves undefined', async () => {
        // Given
        // When
        const actual = await repo.get(id);
        // Then
        expect(actual).to.deep.equal(undefined);
      });
    });

    describe('.save(judge)', () => {
      it('resolves undefined', async () => {
        // Given
        // When
        const actual = await repo.save(judge);
        // Then
        expect(actual).to.deep.equal(undefined);
      });
    });
  });
  context('when a judge has been saved', () => {
    beforeEach(() => repo.save(judge));
    describe('.get(id)', () => {
      it('resolves the same judge', async () => {
        // Given
        // When
        const actual = await repo.get(id);
        // Then
        expect(actual).to.deep.equal(judge);
      });
    });
    describe('.list()', () => {
      it('resolves a list with 1 judge', async () => {
        // Given
        // When
        const actual = await repo.list();
        // Then
        expect(actual).to.deep.equal([judge]);
      });
    });
    describe('.save(updated)', () => {
      it('updates the judge', async () => {
        // Given
        const updated = { ...judge, name: 'Hello' };
        // When
        await repo.save(updated);
        // Then
        expect(await repo.get(id)).to.deep.equal(updated);
      });
    });
  });
  context('when 2 judges have been saved', () => {
    const id2 = 'ZYHUJKL';
    const judge2 = {
      id: id2,
      name: 'Other',
      miss: {
        alsace: {
          mention: 1,
          comment: 'Beurk',
        },
      },
    };
    beforeEach(() => repo.save(judge));
    beforeEach(() => repo.save(judge2));
    describe('.get(id1)', () => {
      it('resolves the judge1', async () => {
        // Given
        // When
        const actual = await repo.get(id);
        // Then
        expect(actual).to.deep.equal(judge);
      });
    });
    describe('.get(id2)', () => {
      it('resolves the judge2', async () => {
        // Given
        // When
        const actual = await repo.get(id2);
        // Then
        expect(actual).to.deep.equal(judge2);
      });
    });
    describe('.list()', () => {
      it('resolves a list with 2 judges', async () => {
        // Given
        // When
        const actual = await repo.list();
        // Then
        expect(actual).to.deep.equal([judge, judge2]);
      });
    });
  });
});
