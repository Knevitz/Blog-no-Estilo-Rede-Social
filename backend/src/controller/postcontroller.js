const PostModel = require('../models/postModel');

// Criar post
exports.createPost = async (req, res) => {
  try {
    const novoPost = await PostModel.create(req.body);
    res.status(201).json(novoPost);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar post', detalhes: err.message });
  }
};

// Listar todos os posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await PostModel.getAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar posts', detalhes: err.message });
  }
};

// Buscar post por ID
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

// Deletar post
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await PostModel.delete(id);
    if (!resultado) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    res.status(200).json({ message: 'Post deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
};

// Curtir post
exports.likePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostModel.like(id);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    res.json({ message: 'Curtida adicionada com sucesso', post });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao curtir o post', detalhes: err.message });
  }
};
