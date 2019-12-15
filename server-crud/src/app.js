// ---Require packages--- //
import express from 'express';
import path from 'path';
import logger from 'morgan';

// ---Const--- //
const app = express();

const favicon = require('serve-favicon');
const compression = require('compression');
const helmet = require('helmet');
// const tabulator = require('tabulator-tables');

// ---app configure--- //
app.use(favicon(path.join(__dirname, 'public', '../../web/public/images/common/favicon.png')));
app.use(logger('dev'));
app.use(helmet());
app.use(compression()); // Compress all routes
app.use(helmet.noSniff());

// ---Sub-Apps--- //
const api = require("../api/app");
const web = require("../web/app");
const auth = require("../web/auth");
// const galleriaDir = require("./galleriaDir");
const errors = require("../errors/app");

app.use("/api", api);
app.use("/", web);
app.use("/", auth);
// app.use("/", galleriaDir);
app.use(errors);

export default app;