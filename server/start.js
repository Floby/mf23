const configureApi = require('./index');
const configureStatic = require('./static');
const express = require('express');

const app = express();
configureApi(app);
configureStatic(app);

app.listen(process.env.PORT || 8080);
