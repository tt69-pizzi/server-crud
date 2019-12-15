const express = require('express');
const router = express.Router();

const pool = require('../../src/database/config');
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// ---GET post page--- //
router.get('/', (req, res) => {
    res.status(200).render('customers/post',
        { title: 'post', message: 'Request for post received' });
});

//--- INSERTING POST--- //
router.post('/', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const author_name = req.body.author_name;
    const post = {
        title: title,
        content: content,
        author_name: author_name,
        created_at: new Date()
    };
    pool.query('INSERT INTO `posts` SET ?', post, (err) => {
        if (err) throw err;
        console.log('Data inserted');
        return res.redirect('post');
    });
});

//--- EDIT PAGE*** NULLED--- //
router.get('/postEdit/:id', (req, res) => {
    const edit_postId = req.params.id;
    const sql = 'SELECT * FROM posts WHERE id=?';
    // FIND POST BY ID
    pool.query(sql, edit_postId, (err, results) => {
        if (err) throw error;
        res.status(200).render('customers/postEdit',{
            post: results[0]
        });
    });
});

// ---GET postEdit page--- //
router.get('/postEdit', (req, res) => {
    res.status(200).render('customers/postEdit',
        { title: 'post-edit', message: 'Request for post-edit received' });
});

//--- POST UPDATING--- //
router.post('/postEdit', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const author_name = req.body.author_name;
    const post = {
        title: title,
        content: content,
        author_name: author_name,
        created_at: new Date()
    };
    pool.query('INSERT INTO `posts` SET ?', post, (err) => {
        if (err) throw err;
        console.log('Data inserted');
        return res.redirect('/');
    });
});

// ---POST DELETING*** NULLED--- //
router.post('/delete/:id', (req, res) => {
    const del_postId = req.params.id;
    const sql = "DELETE FROM posts WHERE id = ?";
    pool.query(sql, del_postId, (err, results) => {
        if (err) throw err;
        res.redirect('post');
    });
});

// ---POST DELETING ALL--- //
router.get('/delete', (req, res) => {
    const sql = `DELETE FROM posts`;
    pool.query(sql,(err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

module.exports = router;