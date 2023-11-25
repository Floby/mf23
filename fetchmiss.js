const prismic = require('@prismicio/client');
const { asText, asImageSrc, asHTML, asLink } = prismic;

async function main() {
  const client = prismic.createClient('mfu24');
  const misses = await client.getAllByType('miss');
  const result = {};
  for (const miss of misses) {
    const id = miss.uid;
    result[id] = {
      id: id,
      région: asText(miss.data.region),
      nom: [asText(miss.data.prenom), asText(miss.data.nom)].join(' '),
      age: miss.data.age,
      taille: miss.data.taille,
      chapo: asText(miss.data.chapo),
      bio: asHTML(miss.data.bio),
      instagramUrl: asLink(miss.data.instagram),
      photos: {
        pied: asImageSrc(miss.data.studio_pied),
        portrait: asImageSrc(miss.data.studio_portrait),
      },
    };
  }
  console.log(JSON.stringify(sortKeys(result), null, '  '));
}

function sortKeys(source) {
  const dest = {};
  const keys = Object.keys(source).sort();
  for (const key of keys) {
    dest[key] = source[key];
  }
  return dest;
}

main().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
