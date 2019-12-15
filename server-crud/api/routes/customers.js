import express from 'express';

const router = express.Router();

// Load the MySQL pool connection
const cache = require('express-redis-cache')({
  host: '192.168.0.102',
  port: 6379, auth_pass: 'redisteo',
  expire: 1800
});
const pool = require('../../src/database/config');
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//---GET customers page---//
router.get('/customers',
  cache.route(), (request, response) => {
    let sql = 'SELECT * FROM customers ORDER BY custID asc';
    pool.query(sql, function (error, result, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }// not connected!
      response.send(result);
    });
  });

router.get('/post',
  cache.route(), (request, response) => {
    // FETCH ALL THE POSTS FROM DATABASE
    let sql = 'SELECT * FROM posts';
    pool.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }// not connected!
      response.send(result);
    });
  });

module.exports = router;