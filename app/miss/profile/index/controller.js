import Controller from '@ember/controller';
import { resource } from 'mf23/resources';
import { service } from '@ember/service';

export default class MissProfileIndexController extends Controller {
  @service panel;
  @service auth;

  constructor(...args) {
    super(...args);
  }

  @resource
  async judgements() {
    return this.panel.getJudgementsForMiss(this.model.miss);
  }
}
