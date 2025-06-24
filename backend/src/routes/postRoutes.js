const express = require('express');
const router = express.Router();
const postController = require('./controller/postController');

// Rota para criar um novo post
router.post('/posts', postController.createPost);

// Rota para listar todos os posts
router.get('/posts', postController.getPosts);

module.exports = router;
