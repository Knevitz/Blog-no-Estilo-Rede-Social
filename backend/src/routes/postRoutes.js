const express = require('express');
const router = express.Router();
const postController = require('.../postController');
const verificarToken = require('../middleware/middleware');

router.post('/posts', verificarToken, postController.createPost);
router.get('/posts', postController.getPosts);
router.get('/posts/:id', postController.getPostById);
router.delete('/posts/:id', verificarToken, postController.deletePost);
router.patch('/posts/:id/like', postController.likePost);

module.exports = router;
