const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/posts');
});

router.get('/posts', function (req, res) {
  res.render('posts-list');
});

router.get('/new-post', async function (req, res) {
  // 'async' & 'await' to listen to the promise
  const [authors] = await db.query('SELECT * FROM authors');
  // the result from db will be 'stored' in an array -
  // the first element is the records, and the second holds metadata
  // [authors] ==> desconstruction the array spreeding out the values and stores in authors
  res.render('create-post', { authors: authors });
});

module.exports = router;
