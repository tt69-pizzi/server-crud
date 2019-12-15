// ---Require packages--- //
import express from 'express';
import path from 'path';
import logger from 'morgan';

// ---Const--- //
const app = express();
const debug = require('debug');

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(logger("dev"));

// ---Resource Not Found--- //
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// ---Global Error Handlers--- //

// ---catch 404 and forward to error handler--- //
app.use(function (req, res, next) {
  debug("app.use", req.path, 404);
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // ---set locals, only providing error in development--- //
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  debug("app.use", "ERROR", err.message);
  // ---render the error page--- //
  res.status(err.status || 500);
  res.render('error', { title: 'error' });
});

module.exports = app;
