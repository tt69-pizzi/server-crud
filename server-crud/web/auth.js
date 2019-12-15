// ---Require packages--- //
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

// ---Const--- //
const app = express();
const session = require('express-session');
const createError = require("http-errors");
const debug = require("debug")("app.js");
const expressLayouts = require('express-ejs-layouts');
const compression = require('compression');
const flash = require('express-flash');

const indexRouter = require("./routes/index").default;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ---set up the session--- //
app.use(cookieParser('keyboard cat'));
app.use(
  session({
    secret: "'keyboard cat'",
    name: "app",
    resave: true,
    saveUninitialized: true
  })
);
app.use(compression()); // Compress all routes
app.use(flash());

// ---setting up the templating view engine--- //
app.set('views', [__dirname + '/views', __dirname + '/views/pages']);
app.set('view engine', 'ejs');
app.use(expressLayouts);

// ---set folder public as static folder for static file--- //
app.use('/assets', express.static(path.join(__dirname, 'public')));

// ---logout--- //
const logout = function (req, res, next) {
  debug("logout()");
  req.session.loggedIn = false;
  res.redirect("/");
};

// ---log-in--- //
const login = function (req, res, next) {
  var { username, password } = req.body;
  if (req.body.username && checkUser(username, password)) {
    debug("login()", username, password);
    req.session.loggedIn = true;
    res.redirect("/");
  } else {
    debug("login()", "Wrong credentials");
    res.render("login", { title: "Login Here", error: "Wrong credentials" });
  }
};

// ---check user--- //
const checkUser = function (username, password) {
  debug("checkUser()", username, password);
  if (username === "matteo" && password === "mau776922van") return true;
  else if (username === "jasmina" && password === "jas92") return true;
  return false;
};

// ---check logged--- //
const checkLoggedIn = function (req, res, next) {
  if (req.session.loggedIn) {
    debug(
      "checkLoggedIn(), req.session.loggedIn:",
      req.session.loggedIn,
      "executing next()"
    );
    next();
  } else {
    debug(
      "checkLoggedIn(), req.session.loggedIn:",
      req.session.loggedIn,
      "rendering login"
    );
    res.render("login", { title: "Login Here" });
  }
};

// ---redirect to login form--- //
app.use("/logout", logout, indexRouter);
app.use("/login", login, indexRouter);
app.use("/", checkLoggedIn, indexRouter);

// ---catch 404 and forward to error handler--- //
app.use(function (req, res, next) {
  debug("app.use", req.path, 404);
  next(createError(404));
});

// ---error handler--- //
app.use(function (err, req, res, next) {
  // ---set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  debug("app.use", "ERROR", err.message);
  // ---render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;