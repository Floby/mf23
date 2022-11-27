const fs = require('fs');
const missList = require('./public/miss.lst.json');
const download = require('image-downloader');
const path = require('path');

main().catch((e) => {
  console.error(e.stack);
  process.exit(1);
});

async function main() {
  const list = missList.sort((a, b) =>
    slugify(a.region) < slugify(b.region) ? -1 : 1
  );
  const ref = {};
  for (const miss of list) {
    const key = slugify(miss.region);
    if (!ref[key]) {
      const assetPath = path.join('miss', `${key}.pied.webp`);
      const dest = path.join(__dirname, 'public', assetPath);
      await download.image({ url: miss.src, dest });
      ref[key] = {
        nom: miss.nom,
        age: 22,
        région: miss.region,
        photos: {
          pied: path.join('/', assetPath),
        },
      };
    } else {
      const assetPath = path.join('miss', `${key}.portrait.webp`);
      const dest = path.join(__dirname, 'public', assetPath);
      await download.image({ url: miss.src, dest });
      ref[key].photos.portrait = path.join('/', assetPath);
    }
  }

  const json = JSON.stringify(ref, null, '  ');
  fs.writeFileSync(
    path.join(__dirname, 'public', 'miss', 'miss.json'),
    json,
    'utf8'
  );
  fs.writeFileSync(
    path.join(__dirname, 'app', 'models', 'miss.json'),
    json,
    'utf8'
  );
  console.log(ref);
}

function slugify(str) {
  return str
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ +_'-]/g, '-');
}
