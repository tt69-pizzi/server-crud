import { Router } from 'express';
import { get, put } from 'memory-cache';

const router = Router();

var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url;
    let cachedBody = get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

// ---GET admin page. with cache--- //
router.all('/admin',  cache(5), function (req, res, next) {
  setTimeout(() => {
    res.status(200).render('pages/admin',
     { title: 'admin', message: 'Request for admin received', date: new Date() });
  }, 5); //setTimeout was used to simulate a slow processing request
});

// ---GET admin page. with cache--- //
router.all('/full-screen',  cache(5), function (req, res, next) {
  setTimeout(() => {
    res.status(200).render('pages/full-screen',
     { title: 'full-screen', message: 'Request for full-screen received', date: new Date() });
  }, 5); //setTimeout was used to simulate a slow processing request
});

// ---GET admin page. with cache--- //
router.all('/note',  cache(5), function (req, res, next) {
  setTimeout(() => {
    res.status(200).render('pages/note',
     { title: 'note', message: 'Request for note received', date: new Date() });
  }, 5); //setTimeout was used to simulate a slow processing request
});

// ---GET admin page. with cache--- //
router.all('/map',  cache(5), function (req, res, next) {
  setTimeout(() => {
    res.status(200).render('pages/map',
     { title: 'map', message: 'Request for map received', date: new Date() });
  }, 5); //setTimeout was used to simulate a slow processing request
});

// ---GET admin page. with cache--- //
router.all('/vectorMap',  cache(5), function (req, res, next) {
  setTimeout(() => {
    res.status(200).render('pages/vectorMap',
     { title: 'vectorMap', message: 'Request for vectorMap received', date: new Date() });
  }, 5); //setTimeout was used to simulate a slow processing request
});

// ---GET admin page. with cache--- //
router.all('/galleria', cache(10), function (req, res, next) {
  setTimeout(() => {
    res.status(200).render('pages/galleria',
     { title: 'galleria', message: 'Request for galleria received', date: new Date() });
  }, 10); //setTimeout was used to simulate a slow processing request
});

// ---GET admin page. with cache--- //
router.all('/file', cache(10), function (req, res, next) {
  setTimeout(() => {
    res.status(200).render('pages/file',
     { title: 'file', message: 'Request for file received', date: new Date() });
  }, 10); //setTimeout was used to simulate a slow processing request
});

// ---GET admin page. with cache--- //
router.all('/user',  cache(5), function (req, res, next) {
  setTimeout(() => {
    res.status(200).render('pages/user',
     { title: 'user', message: 'Request for user received', date: new Date() });
  }, 5); //setTimeout was used to simulate a slow processing request
});

export default router;