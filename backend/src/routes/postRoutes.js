const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');
const verificarToken = require('../middleware/middleware.js');

router.post('/posts', postController.createPost);
router.get('/posts', postController.getPosts);

module.exports = router;