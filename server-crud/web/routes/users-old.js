const express = require('express');
const router = express.Router();

const pool = require('../../src/database/config');
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/* GET home page. */
router.get('/', function (req, res, next) {
  let sql = 'SELECT * FROM users ORDER BY id desc';
  pool.query(sql, function (err, rows) {
    if (err) {
      req.flash('error', err);
      res.render('users/index', { page_title: "users - Node.js", data: '' });
    } else {
      res.render('users/index', { page_title: "users - Node.js", data: rows });
    }
  });
});

// SHOW ADD USER FORM
router.get('/add', function (req, res, next) {
  // render to views/user/add.ejs
  res.render('users/add', {
    title: 'Add New users',
    name: '',
    email: ''
  });
});

// ADD NEW USER POST ACTION
router.post('/add', function (req, res, next) {
  req.assert('name', 'Name is required').notEmpty();           //Validate name
  req.assert('email', 'A valid email is required').isEmail();  //Validate email

  var errors = req.validationErrors();

  if (!errors) {   //No errors were found.  Passed Validation!
    var user = {
      name: req.sanitize('name').escape().trim(),
      email: req.sanitize('email').escape().trim()
    };

    pool.query('INSERT INTO users SET ?', user, function (err, result) {
      //if(err) throw err
      if (err) {
        req.flash('error', err);
        // render to views/user/add.ejs
        res.render('users/add', {
          title: 'Add New User',
          name: user.name,
          email: user.email
        });
      } else {
        req.flash('success', 'Data added successfully!');
        res.redirect('users/index');
      }
    });
  }
  else {   //Display errors to user
    var error_msg = '';
    errors.forEach(function (error) {
      error_msg += error.msg + '<br>';
    });
    req.flash('error', error_msg);

    /**
     * Using req.body.name 
     * because req.param('name') is deprecated
     */
    res.render('users/add', {
      title: 'Add New Customer',
      name: req.body.name,
      email: req.body.email
    });
  }
});

// SHOW EDIT USER FORM
router.get('/edit/(:id)', function (req, res, next) {

  pool.query('SELECT * FROM users WHERE id = ' + req.params.id, function (err, rows, fields) {
    if (err) throw err;

    // if user not found
    if (rows.length <= 0) {
      req.flash('error', 'users not found with id = ' + req.params.id);
      res.redirect('/users');
    }
    else { // if user found
      // render to views/user/edit.ejs template file
      res.render('users/edit', {
        title: 'Edit User',
        //data: rows[0],
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email
      });
    }
  });
});

// EDIT USER POST ACTION
router.post('/update/:id', function (req, res, next) {
  req.assert('name', 'Name is required').notEmpty();           //Validate nam           //Validate age
  req.assert('email', 'A valid email is required').isEmail();  //Validate email

  var errors = req.validationErrors();

  if (!errors) {
    var user = {
      name: req.sanitize('name').escape().trim(),
      email: req.sanitize('email').escape().trim()
    };

    connection.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function (err, result) {
      //if(err) throw err
      if (err) {
        req.flash('error', err);

        // render to views/user/add.ejs
        res.render('users/edit', {
          title: 'Edit User',
          id: req.params.id,
          name: req.body.name,
          email: req.body.email
        });
      } else {
        req.flash('success', 'Data updated successfully!');
        res.redirect('users/index');
      }
    });
  }
  else {   //Display errors to user
    var error_msg = '';
    errors.forEach(function (error) {
      error_msg += error.msg + '<br>';
    });
    req.flash('error', error_msg);

    /**
     * Using req.body.name 
     * because req.param('name') is deprecated
     */
    res.render('users/edit', {
      title: 'Edit User',
      id: req.params.id,
      name: req.body.name,
      email: req.body.email
    });
  }
});

// DELETE USER
router.get('/delete/(:id)', function (req, res, next) {
  var user = { id: req.params.id };

  connection.query('DELETE FROM users WHERE id = ' + req.params.id, user, function (err, result) {
    //if(err) throw err
    if (err) {
      req.flash('error', err);
    } else {
      req.flash('success', 'User deleted successfully! id = ' + req.params.id);
      // redirect to users list page
      res.redirect('/users/index');
    }
  });
});

module.exports = router;