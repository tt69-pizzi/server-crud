const express = require('express');
const router = express.Router();
const mcache = require('memory-cache');

var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url;
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

//---GET admin page. with cache---//
router.get('/tbCustomers', cache(10), function (req, res, next) {
  setTimeout(() => {
    res.render("customers/tbCustomers",
     { title: 'customers', message: 'Request for customers received', date: new Date() });
  }, 10); //setTimeout was used to simulate a slow processing request
});

module.exports = router;