import express from 'express';
const router = express.Router();

// Load the MySQL pool connection
const cache = require('express-redis-cache')({
  host: '192.168.0.102',
  port: 6379, auth_pass: 'redisteo'
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

 // ADD NEW USER POST ACTION
 router.post('/add', function(req, res, next){    
     req.assert('name', 'Name is required').notEmpty();          //Validate name
     req.assert('email', 'A valid email is required').isEmail();  //Validate email
   
     var errors = req.validationErrors();
      
     if( !errors ) {   //No errors were found.  Passed Validation!
          
      
         var user = {
             name: req.sanitize('name').escape().trim(),
             email: req.sanitize('email').escape().trim()
         };
          
      pool.query('INSERT INTO customers SET ?', user, function(err, result) {
                 //if(err) throw err
                 if (err) {
                     req.flash('error', err);
                      
                     // render to views/user/add.ejs
                     res.render('customers/add', {
                         title: 'Add New Customer',
                         name: user.name,
                         email: user.email                    
                     });
                 } else {                
                     req.flash('success', 'Data added successfully!');
                     res.redirect('/customers');
                 }
             });
     }
     else {   //Display errors to user
         var error_msg = '';
         errors.forEach(function(error) {
             error_msg += error.msg + '<br>';
         });                
         req.flash('error', error_msg);        
          
         /**
          * Using req.body.name 
          * because req.param('name') is deprecated
          */ 
         res.render('customers/add', { 
             title: 'Add New Customer',
             name: req.body.name,
             email: req.body.email
         });
     }
 });
  
 // SHOW EDIT USER FORM
 router.get('/edit/(:id)', function(req, res, next){
    
 pool.query('SELECT * FROM customers WHERE id = ' + req.params.id, function(err, rows, fields) {
             if(err) throw err;
              
             // if user not found
             if (rows.length <= 0) {
                 req.flash('error', 'Customers not found with id = ' + req.params.id);
                 res.redirect('/customers');
             }
             else { // if user found
                 // render to views/user/edit.ejs template file
                 res.render('customers/edit', {
                     title: 'Edit Customer', 
                     //data: rows[0],
                     id: rows[0].id,
                     name: rows[0].name,
                     email: rows[0].email                    
                 });
             }            
         });
   
 });
  
 // EDIT USER POST ACTION
 router.post('/update/:id', function(req, res, next) {
     req.assert('name', 'Name is required').notEmpty();           //Validate nam           //Validate age
     req.assert('email', 'A valid email is required').isEmail();  //Validate email
   
     var errors = req.validationErrors();
      
     if( !errors ) {   
  
         var user = {
             name: req.sanitize('name').escape().trim(),
             email: req.sanitize('email').escape().trim()
         };
          
 pool.query('UPDATE customers SET ? WHERE id = ' + req.params.id, user, function(err, result) {
                 //if(err) throw err
                 if (err) {
                     req.flash('error', err);
                      
                     // render to views/user/add.ejs
                     res.render('customers/edit', {
                         title: 'Edit Customer',
                         id: req.params.id,
                         name: req.body.name,
                         email: req.body.email
                     });
                 } else {
                     req.flash('success', 'Data updated successfully!');
                     res.redirect('/customers');
                 }
             });
          
     }
     else {   //Display errors to user
         var error_msg = '';
         errors.forEach(function(error) {
             error_msg += error.msg + '<br>';
         });
         req.flash('error', error_msg);
          
         /**
          * Using req.body.name 
          * because req.param('name') is deprecated
          */
         res.render('customers/edit', { 
             title: 'Edit Customer',            
             id: req.params.id, 
             name: req.body.name,
             email: req.body.email
         });
     }
 });
        
 // DELETE USER
 router.get('/delete/(:id)', function(req, res, next) {
     var user = { id: req.params.id };
      
 pool.query('DELETE FROM customers WHERE id = ' + req.params.id, user, function(err, result) {
             //if(err) throw err
             if (err) {
                 req.flash('error', err);
                 // redirect to users list page
                 res.redirect('/customers');
             } else {
                 req.flash('success', 'Customer deleted successfully! id = ' + req.params.id);
                 // redirect to users list page
                 res.redirect('/customers');
             }
         });
    });

/*
//---get method for fetch all customers---//
router.all('/all',
    cache.route(), async function (req, res) {
      let sql = 'SELECT * FROM customers ORDER BY id desc';
      let q = pool.query(sql, function (err, rows, fields));
      let editor = new Editor( q ).fields(
        new Field('custID'),
        new Field('name'),
        new Field('address'),
        new Field('city'),
        new Field('email'),
        new Field('phone'),
        new Field('note')
      )
      await editor.process(req.body)
      res.json(editor.data())
    });

//---get method for fetch single customer---//
router.get('/:id',
  cache.route(), function (req, res, next) {
    var id = req.params.id;
    var sql = `SELECT * FROM customers WHERE id=${id}`;
    pool.query(sql, function (err, row, fields) {
      if (err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json(row[0])
    })
  });

//---post method for create product---//
router.post('/create',
  cache.route(), function (req, res, next) {
    var name = req.body.name;
    var email = req.body.email;

    var sql = `INSERT INTO customers (name, email) VALUES ('${name}', ${email}', 1, NOW())`;
    pool.query(sql, function (err, result) {
      if (err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json({ 'status': 'success', id: result.insertId })
    })
  });

//---put method for update product---//
router.put('/update/:id',
  cache.route(), function (req, res, next) {
    var id = req.params.id;
    var name = req.body.name;
    var email = req.body.email;

    var sql = `UPDATE customers SET name='${name}', email='${email}' WHERE id=${id}`;
    pool.query(sql, function (err, result) {
      if (err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json({ 'status': 'success' })
    })
  });

//---delete method for delete product---//
router.delete('/delete/:id',
  cache.route(), function (req, res, next) {
    var id = req.params.id;
    var sql = `DELETE FROM customers WHERE id=${id}`;
    pool.query(sql, function (err, result) {
      if (err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json({ 'status': 'success' })
    })
  })*/

module.exports = router;