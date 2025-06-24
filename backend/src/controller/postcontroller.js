const PostModel = require('../models/postModel');

exports.createPost = async (req, res) => {
  try {
    const novoPost = await PostModel.create(req.body);
    res.status(201).json(novoPost);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar post', detalhes: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await PostModel.getAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar posts', detalhes: err.message });
  }
};
exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostModel.getById(id);
    if (!post) {
      return res.status(404).json({ erro: 'Post não encontrado' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar post', detalhes: err.message });
  }
};  