import ref from './miss.referential';
import bio from './bio.referential';

const Miss = {
  get(id) {
    const miss = ref[id];
    if (!id) return null;
    return {
      ...miss,
      bio: bio[id],
      id,
      prev: this.getPreviousId(id),
      next: this.getNextId(id),
    };
  },

  getPreviousId(id) {
    const ids = Object.keys(ref);
    const index = ids.indexOf(id);
    return ids[index - 1] || this.getLastId();
  },

  getNextId(id) {
    const ids = Object.keys(ref);
    const index = ids.indexOf(id);
    return ids[index + 1] || this.getFirstId();
  },

  getFirstId() {
    return Object.keys(ref)[0];
  },

  getLastId() {
    return Object.keys(ref).reverse()[0];
  },

  getAll() {
    return Object.keys(ref).map((id) => this.get(id));
  },
};

export default Miss
