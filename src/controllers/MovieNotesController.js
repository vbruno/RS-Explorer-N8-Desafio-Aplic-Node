const dayjs = require('dayjs');
const knex = require('../database/knex');

class MovieNotesController {
  async create(req, res) {
    const {
      title, description, rating, userId,
    } = req.body;

    if (!title || !description || !rating || !userId) {
      return res.status(400).json({ error: 'Missing body parameter' });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 0 and 5' });
    }

    const userExists = await knex('users').where({ id: userId });

    if (!userExists) {
      return res.status(400).json({ error: 'User not found' });
    }

    console.log(userExists);

    const [movieNote] = await knex('movie_notes').insert({
      title,
      description,
      rating,
      user_id: userId,
    }).returning('*');

    return res.json(movieNote);
  }

  async showAll(req, res) {
    const movieNotes = await knex('movie_notes').select('*');
    return res.json(movieNotes);
  }

  async index(req, res) {
    const { id } = req.params;

    const idExists = await knex('movie_notes').where({ id });

    if (!idExists) {
      return res.status(400).json({ error: 'Movie note not found' });
    }

    const [movieNote] = await knex('movie_notes').where({ id });

    return res.json(movieNote);
  }

  async delete(req, res) {
    const { id } = req.params;

    const result = await knex('movie_notes').where({ id }).del();

    return res.json(result);
  }

  async update(req, res) {
    const { id } = req.params;
    const {
      title, description, rating,
    } = req.body;

    const [movieNoteExists] = await knex('movie_notes').where({ id });

    if (!movieNoteExists) {
      return res.status(400).json({ error: 'Movie note not found' });
    }

    const [movieNote] = await knex('movie_notes').where({ id }).update({
      title: title ?? movieNoteExists.title,
      description: description ?? movieNoteExists.description,
      rating: rating ?? movieNoteExists.rating,
      update_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }).returning('*');

    return res.json(movieNote);
  }
}

module.exports = new MovieNotesController();
