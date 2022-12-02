import Controller from '@ember/controller';

export default class MissProfileController extends Controller {
  get taille() {
    return this.model.taille.toFixed(2);
  }
}
