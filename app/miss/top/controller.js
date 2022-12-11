import Controller from '@ember/controller';
import { Mentions } from '../../models/mention';

export default class MissTopController extends Controller {
  get mentions() {
    return Mentions.map((m, i) => i).reverse();
  }
}
