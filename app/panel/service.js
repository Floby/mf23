import Service, { service } from '@ember/service';
import percentile from 'percentile';
import Miss from '../models/miss';
import { InsertSort } from '../lib/insert-sort';

export default class PanelService extends Service {
  @service auth;

  async getById(id) {
    const panel = await this.#getAll();
    const judge = panel.find((j) => j.id === id);
    if (judge) {
      return judge;
    }
    throw Error('Could not find judge');
  }

  async getJudgementsForMiss(miss) {
    if (!this.auth.isAuthenticated) {
      return [];
    }
    const json = await this.#getAll();
    const judgements = [];
    for (const judge of json) {
      if (judge.id === this.auth.userInfo.sub) {
        continue;
      }
      const judgement = judge.miss[miss.id];
      if (judgement) {
        judgements.push({
          ...judgement,
          judge: { id: judge.id, nom: judge.nom },
        });
      }
    }
    return judgements;
  }

  async getJudgesStats() {
    const json = await this.#getAll();
    const allFavs = [];
    for (const j of json) {
      await noblock();
      const favver = j.nom;
      for (const [miss, m] of Object.entries(j.miss)) {
        for (const favvee of m.favs || []) {
          allFavs.push({ favvee, favver, miss });
        }
      }
    }
    const stats = [];
    for (const j of json) {
      await noblock();
      stats.push({
        id: j.id,
        hasTop: Boolean(j.top?.miss.length),
        nom: j.nom,
        avatar: j.avatar,
        since: Math.min(...Object.values(j.miss).map((m) => m.createdAt)),
        progress: Object.values(j.miss).length / Miss.getAll().length,
        favTotal: allFavs.filter(({ favvee }) => favvee === j.id).length,
        fan: this.#getFanForFavvee(allFavs, j.id),
        favourite: this.#getFavouriteForFavver(allFavs, j.nom, json),
        median:
          Math.round(
            percentile(
              50,
              Object.values(j.miss).map((m) => m.mention)
            )
          ) || 0,
      });
    }
    console.log(stats);
    return stats;
  }

  #getFanForFavvee(favs, favvee) {
    const fans = {};
    for (const fav of favs.filter((f) => f.favvee === favvee)) {
      fans[fav.favver] = (fans[fav.favver] || 0) + 1;
    }
    const fan = Object.entries(fans)
      .sort((a, b) => a[1] - b[1])
      .pop();
    return fan ? { nom: fan[0], favs: fan[1] } : null;
  }

  #getFavouriteForFavver(favs, favver, judges) {
    const favourites = {};
    for (const fav of favs.filter((f) => f.favver === favver)) {
      favourites[fav.favvee] = (favourites[fav.favvee] || 0) + 1;
    }
    const favourite = Object.entries(favourites)
      .sort((a, b) => a[1] - b[1])
      .pop();
    if (!favourite) {
      return null;
    }
    const judge = judges.find((j) => j.id === favourite[0]);
    return { nom: judge.nom, favs: favourite[1] };
  }

  async getTop() {
    const misses = Miss.getAll();
    const allJudges = await this.#getAll();
    const judges = allJudges.filter(
      (j) => Object.keys(j.miss).length === misses.length
    );
    const top2 = new InsertSort(compareTopRank);
    for (const miss of misses) {
      await noblock();
      const mentions = judges.map((j) => j.miss[miss.id]?.mention || 0).sort();
      const mention = Math.round(percentile(50, mentions));
      await noblock();
      const proponents = mentions.filter((m) => m > mention).length;
      const opponents = mentions.filter((m) => m < mention).length;
      const rank = {
        région: miss.région,
        miss,
        mention,
        mentions,
        proponents,
        opponents,
      };
      top2.push(rank);
    }
    await noblock();
    return [...top2];
  }

  async getJudgeTop(judgeId) {
    const judges = await this.#getAll();
    return judges.find((j) => j.id === judgeId);
  }

  async #getAll() {
    const url = `/api/judge`;
    const token = this.auth.accessToken;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    return json;
  }
}

const A_THEN_B = -1;
const B_THEN_A = 1;
function compareTopRank(a, b) {
  if (a.mention !== b.mention) {
    return a.mention > b.mention ? A_THEN_B : B_THEN_A;
  }
  for (let i = 0; i < 6; ++i) {
    const aPro = a.mentions.filter((m) => m > a.mention + i).length;
    const bPro = b.mentions.filter((m) => m > b.mention + i).length;
    const aCon = a.mentions.filter((m) => m < a.mention - i).length;
    const bCon = b.mentions.filter((m) => m < b.mention - i).length;
    const mPro = Math.max(aPro, bPro);
    const mCon = Math.max(aCon, bCon);
    if (mPro > mCon && aPro !== bPro) {
      return aPro > bPro ? A_THEN_B : B_THEN_A;
    }
    if (mCon >= mPro && aCon !== bCon) {
      return aCon > bCon ? B_THEN_A : A_THEN_B;
    }
  }
  return a.miss.age + a.miss.taille > b.miss.age + b.miss.taille
    ? B_THEN_A
    : A_THEN_B;
}

const noblock = () => delay(0);
function delay(ms) {
  return new Promise((ok) => setTimeout(ok, ms));
}
