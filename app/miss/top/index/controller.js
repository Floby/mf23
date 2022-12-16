import Controller from '@ember/controller';
import { Mentions } from '../../../models/mention';
import { service } from '@ember/service';

export default class MissTopIndexController extends Controller {
  @service auth;
  get mentions() {
    return Mentions.map((m, i) => i).reverse();
  }
}
