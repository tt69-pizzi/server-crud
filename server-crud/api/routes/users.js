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

// ---SHOW LIST OF USERS--- //
router.get('/list',
    cache.route(), (request, response) => {
        let sql = 'SELECT * FROM users ORDER BY id asc';
        pool.query(sql, function (error, result, fields) {
            //if(err) throw err
            if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
            }// not connected! render to views/user/list.ejs template file
            response.send(result);
        });
    });

// ---ADD NEW USER POST ACTION--- //
router.post('/list', (req, res) => {
    // Passed Validation!
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const user = {
        name: name,
        email: email,
        password: password,
        email_verified_at: new Date(),
        update_at: new Date()
    };
    pool.query('INSERT INTO `users` SET ?', user, (err) => {
        //if(err) throw err
        if (err) throw err;
        console.log('Data inserted');
        return res.redirect('/list');
    });
});

module.exports = router;