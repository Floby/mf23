import Controller from '@ember/controller';

export default class JudgesController extends Controller {
  get judges() {
    return this.model.judges.sort((a, b) => {
      if (a.progress !== b.progress) {
        return b.progress - a.progress;
      }
      if (a.hasTop !== b.hasTop) {
        return a.hasTop ? -1 : 1;
      }
      if (a.favTotal !== b.favTotal) {
        return b.favTotal - a.favTotal;
      }
      return a.since - b.since;
    });
  }
}
