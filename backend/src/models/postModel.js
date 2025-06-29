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

  // Listar todos os posts
  async getAll() {
    try {
      const result = await pool.query(`SELECT * FROM posts ORDER BY post_date DESC`);
      return result.rows;
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
      throw err;
    }
  },

  // Buscar post por ID
  async getById(id) {
    try {
      const result = await pool.query(`SELECT * FROM posts WHERE id = $1`, [id]);
      return result.rows[0];
    } catch (err) {
      console.error('Erro ao buscar post por ID:', err);
      throw err;
    }
  },

  // Deletar post por ID
  async delete(id) {
    try {
      const result = await pool.query(`DELETE FROM posts WHERE id = $1 RETURNING *`, [id]);
      return result.rowCount > 0;
    } catch (err) {
      console.error('Erro ao deletar post:', err);
      throw err;
    }
  }
};

async function like(id) {
  const result = await pool.query(
    `UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

module.exports = {
  create,
  getAll,
  delete: deletePost, // renomeado se precisar
  like, // ✅ nova função exportada
};

module.exports = PostModel;
