import express, { Router } from 'express';
import { get, put } from 'memory-cache';

const app = express();
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

// ---all requests to this router will first hit this middleware--- //
router.use(function (req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

// ---middleware that is specific to this router--- //
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

// ---split up route handling--- //
router.use('/bolli', require('./bolli'));
router.use('/customers', require('./customers'));
router.use('/users', require('./users'));
router.use('/post', require('./post'));
router.use('/pages', require('./pages').default);

// ---the catch all route--- //
app.all('*', (req, res) => {
    res.status(404).send({ msg: 'not found' });
});

// ---GET home page. with cache--- //
router.get('/', function (req, res, next) {
    res.status(200).render('home',
        { title: 'home', message: 'Request for home received', date: new Date() });
});

// ---GET admin page. with cache--- //
router.all('/login', cache(10), function (req, res, next) {
    setTimeout(() => {
        res.status(200).render('login',
            { title: 'login', message: 'Request for login received', date: new Date() });
    }, 10); //setTimeout was used to simulate a slow processing request
});

// ---GET admin page. with cache--- //
router.all('/lock', cache(10), function (req, res, next) {
    setTimeout(() => {
        res.status(200).render('lock',
            { title: 'lock', message: 'Request for lock received', date: new Date() });
    }, 10); //setTimeout was used to simulate a slow processing request
});

export default router;