const pool = require('../config/db');

const PostModel = {
  // Criação de novo post
  async create(post) {
    const { user_name, user_tag, user_photo, content, post_date } = post;

    try {
      const result = await pool.query(
        `INSERT INTO posts (user_name, user_tag, user_photo, content, post_date)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [user_name, user_tag, user_photo, content, post_date]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Erro ao criar post:', err);
      throw err;
    }
  },

  // Listagem de todos os posts
  async getAll() {
    try {
      const result = await pool.query(
        `SELECT * FROM posts ORDER BY post_date DESC`
      );
      return result.rows;
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
      throw err;
    }
  }
};

module.exports = PostModel;
