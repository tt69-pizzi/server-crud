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

// GET catalog home page.
router.get('/data-bolli-all',
  cache.route(), (request, response) => {
    let sql = 'SELECT * FROM Summarized WHERE Dat_OUT IS NULL';
    pool.query(sql, function (error, result, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }// not connected!
      response.send(result);
    });
  });

// GET catalog 10 home page.
router.get('/bolli-10',
  cache.route(), (request, response) => {
    let sql = 'SELECT * FROM Summarized LIMIT 10';
    pool.query(sql, function (error, result, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }// not connected!
      response.send(result);
    });
  });

  // GET item home page.
router.get('/item', (request, response) => {
  let sql = 'SELECT * FROM item';
  pool.query(sql, function (error, result, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    } // not connected!
    response.send(result);
  });
});

// GET request for creating a bolli. NOTE This must come before routes that display bolli (uses id).
router.post('/create',
  cache.route(), (req, res) => {
    let data = { product_name: req.body.product_name, product_price: req.body.product_price };
    let sql = 'INSERT INTO Summarized SET ?';
    let query = pool.query(sql, data, (error, results) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.redirect('/');
    });
  });

// POST request for creating bolli.
router.post('/create',
  cache.route(), (req, res) => {
    let data = { product_name: req.body.product_name, product_price: req.body.product_price };
    let sql = 'INSERT INTO Summarized SET ?';
    let query = pool.query(sql, data, (error, results) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.redirect('/');
    });
  });

// GET request to delete bolli.
router.get('/:id/delete',
  cache.route(), (req, res) => {
    let sql = 'DELETE FROM Summarized WHERE product_id=' + req.body.product_id + '';
    let query = pool.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.redirect('/');
    });
  });

// POST request to delete bolli.
router.post('/:id/delete',
  cache.route(), (req, res) => {
    let sql = 'DELETE FROM Summarized WHERE product_id=' + req.body.product_id + '';
    let query = pool.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.redirect('/');
    });
  });

// GET request to update bolli.
router.get('/:id/update',
  cache.route(), (req, res) => {
    let sql = 'UPDATE FROM Summarized WHERE product_id=' + req.body.product_id + '';
    let query = pool.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.redirect('/');
    });
  });

// POST request to update bolli.
router.post('/:id/update',
  cache.route(), (req, res) => {
    let sql = 'UPDATE FROM Summarized WHERE product_id=' + req.body.product_id + '';
    let query = pool.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.redirect('/');
    });
  });

// GET request for one bolli.
router.get('/:id/select',
  cache.route(), function (req, res) {
    let bolli_id = req.params.id;
    if (!user_id) {
      return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    let sql = 'SELECT FROM Summarized WHERE bolli_id=' + req.body.bolli_id + '';
    pool.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }
      res.redirect('/');
    });
  });

module.exports = router;