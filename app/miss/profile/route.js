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
        pied: 'https://scontent-cdt1-1.cdninstagram.com/v/t51.2885-15/313913894_1860859260923050_4435085346467925150_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-cdt1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=NfF12g7ahO0AX_uIt8d&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=Mjk2Mjc2ODUxNDY2MjQ3ODY1OQ%3D%3D.2-ccb7-5&oh=00_AfCwluFVD5vUKa7C9Ou7ilNS3UKw129TDpubcl74G3rZhA&oe=637DD580&_nc_sid=30a2ef'
        maillot: 'https://scontent-cdt1-1.cdninstagram.com/v/t51.2885-15/286306156_579411033604325_8782273552882299900_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-cdt1-1.cdninstagram.com&_nc_cat=105&_nc_ohc=sLNQ7b7fxb4AX-Xk4LM&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=Mjg1NjIyMTMwOTUzNDU3NzM0MQ%3D%3D.2-ccb7-5&oh=00_AfBLmyvWHDXWsIwoRGBB4Ido9MTFJnl4qHOJ6uBT4xKVZg&oe=637DB714&_nc_sid=30a2ef'
      },
    };
  }
}
