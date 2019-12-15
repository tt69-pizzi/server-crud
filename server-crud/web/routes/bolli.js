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

// ---GET admin page. with cache--- //
router.get('/tbBolli', cache(10), function (req, res, next) {
  setTimeout(() => {
    res.render("pages/tbBolli",
     { title: 'tbBolli', message: 'Request for tbBolli received', date: new Date() });
  }, 10); //setTimeout was used to simulate a slow processing request
});

// ---GET admin page. with cache--- //
router.get('/addBolli', cache(10), function (req, res, next) {
  setTimeout(() => {
    res.render("pages/addBolli",
     { title: 'addBolli', message: 'Request for tbBolli received', date: new Date() });
  }, 10); //setTimeout was used to simulate a slow processing request
});

// ---GET admin page. with cache--- //
router.all('/jplist', cache(10), function (req, res, next) {
  setTimeout(() => {
    res.status(200).render('pages/jplist',
     { title: 'jplist', message: 'Request for jplist received', date: new Date() });
  }, 10); //setTimeout was used to simulate a slow processing request
});

// ---GET admin page. with cache--- //
router.all('/galleria', cache(10), function (req, res, next) {
  setTimeout(() => {
    res.status(200).render('pages/galleria',
     { title: 'galleria', message: 'Request for galleria received', date: new Date() });
  }, 10); //setTimeout was used to simulate a slow processing request
});

// ---GET admin page. with cache--- //
router.all('/tbBolliImg', cache(10), function (req, res, next) {
  setTimeout(() => {
    res.status(200).render('pages/tbBolliImg',
     { title: 'tbbolliImg', message: 'Request for tbbolliImg received', date: new Date() });
  }, 10); //setTimeout was used to simulate a slow processing request
});

module.exports = router;