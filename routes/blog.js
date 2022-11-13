const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/posts');
});

router.get('/posts', async function (req, res) {
  const query = `
  SELECT posts.*, authors.name AS author_name from posts 
  INNER JOIN authors ON posts.author_id = authors.id
  `; // using `` for more readability
  const [posts] = await db.query(query);
  res.render('posts-list', { posts: posts });
});

router.get('/new-post', async function (req, res) {
  // 'async' & 'await' to listen to the promise
  const [authors] = await db.query('SELECT * FROM authors');
  // the result from db will be 'stored' in an array -
  // the first element is the records, and the second holds metadata
  // [authors] ==> desconstruction the array spreeding out the values and stores in authors
  res.render('create-post', { authors: authors });
});

router.post('/posts', async function (req, res) {
  // listen to post request
  const data = [
    req.body.title, // hold the incomming data (name form tag from create post)
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  await db.query('INSERT INTO posts (title, summary, body, author_id) VALUES (?)',[
    data // here all the values that want to insert on (?): title, summary, content & author
  ]
  );
  // '?' place holder that will be replaced by the array '[data]'
  // the package mysql will automatically spread out into separated values
  res.redirect('/posts');
});

router.get('/posts/:id', async function(req,res){
  const query = `
  SELECT posts.*, authors.name AS author_name, authors.email AS author_email FROM posts 
  INNER JOIN authors ON posts.author_id = authors.id
  WHERE posts.id = ?
  `;

  const [posts] = await db.query(query, [req.params.id]); 
  // thats how extract the concreat value of the id place holder
  // from the path for which this router was loaded - e.g localhost/posts/1 path
  // created automatically on browser replacing '?'

  // to hande if manually type the id and there's no matching post
  if (!posts || posts.length === 0) {
    return res.status(404).render('404'); // with the return the next line wont be executed
  }

  res.render('post-detail', { post: posts[0] }); // the second paramenter exposes the post const
});

module.exports = router;
