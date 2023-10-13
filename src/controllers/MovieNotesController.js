const dayjs = require('dayjs');
const AppError = require('../utils/AppError');

const knex = require('../database/knex');

class MovieNotesController {
  async create(req, res) {
    const {
      title, description, rating, userId, tags,
    } = req.body;

    if (!title || !description || !rating || !userId || !tags) {
      throw new AppError('Missing body parameter', 400);
    }

    if (rating < 0 || rating > 5) {
      throw new AppError('Rating must be between 0 and 5', 400);
    }

    const userExists = await knex('users').where({ id: userId });

    if (!userExists) {
      throw new AppError('User not found', 400);
    }

    if (!tags) {
      throw new AppError('Missing tags', 400);
    }

    const [movieNote] = await knex('movie_notes').insert({
      title,
      description,
      rating,
      user_id: userId,
    }).returning('*');

    console.log(tags);

    const tagsInsert = tags.map((name) => ({
      movieNote_id: movieNote.id,
      user_id: userId,
      name,
    }));

    console.log(tagsInsert);

    await knex('movie_tags').insert(tagsInsert);

    return res.json({ ...movieNote, tags: tagsInsert });
  }

  async showAll(req, res) {
    const movieNotes = await knex('movie_notes').select('*');
    return res.json(movieNotes);
  }

  async index(req, res) {
    const { id } = req.params;

    const idExists = await knex('movie_notes').where({ id });

    if (!idExists) {
      throw new AppError('Movie note not found', 400);
    }

    const [movieNote] = await knex('movie_notes').where({ id });

    const tags = await knex('movie_tags').where({ user_id: id }).orderBy('name');

    return res.json({ ...movieNote, tags });
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
      throw new AppError('Movie note not found', 400);
    }
    if (rating) {
      if (rating < 0 || rating > 5) {
        throw new AppError('Rating must be between 0 and 5', 400);
      }
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
