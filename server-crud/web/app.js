import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import logger from 'morgan';

// ---Const--- //
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const compression = require('compression');
const flash = require('express-flash');

// ---Returns middleware that parses json--- //
app.use(bodyParser.json());

// ---let us use HTTP verbs such as PUT or DELETE in places where they are not supported--- //
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// ---setting up the templating view engine--- //
app.set('views', [__dirname + '/views', __dirname + '/views/pages']);
app.set('view engine', 'ejs');
app.use(expressLayouts);

// ---set folder public as static folder for static file--- //
app.use('/assets', express.static(path.join(__dirname, 'public')));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression()); // Compress all routes
app.use(flash());

// ---Exports--- //
module.exports = app;
