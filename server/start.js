const configureApi = require('./index');
const configureStatic = require('./static');
const express = require('express');

async function main() {
  const app = express();
  configureApi(app);
  configureStatic(app);

  app.listen(process.env.PORT || 8080);
}

main().catch((error) => {
  console.error(error.stack);
  process.exit(1);
});
