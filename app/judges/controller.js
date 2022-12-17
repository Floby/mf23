import Controller from '@ember/controller';
import Awards from '../models/awards';

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

  get awards() {
    return {};
    return Awards;
  }

  displayAward(award, nom) {
    window.alert(`${nom} est ${award.title} !\n\n${award.description}`);
  }
}
