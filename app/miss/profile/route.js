import Route from '@ember/routing/route';

export default class MissProfileRoute extends Route {
  async model(params) {
    const { miss_id } = params;
    return {
      id: miss_id,
      région: 'Alsace',
      nom: 'Elsa Mülhimmler',
      age: 22,
      photos: {
        portrait:
          'https://static.actu.fr/uploads/2022/10/camille-sedira-1024x1024-960x640.png',
        pied: '/01-pied.jpg',
        maillot: '/01-maillot.jpg',
      },
    };
  }
}
