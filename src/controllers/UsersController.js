const { hash } = require('bcryptjs');
const dayjs = require('dayjs');

const AppError = require('../utils/AppError');
const knex = require('../database/knex');

// eslint-disable no-unused-vars
class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Missing body parameter', 400);
    }

    if (!email.includes('@')) {
      throw new AppError('Invalid email', 400);
    }

    const [userExists] = await knex('users').where({ email });

    if (userExists) {
      throw new AppError('User already exists', 400);
    }

    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    } if (password.length > 20) {
      throw new AppError('Password must be less than 20 characters', 400);
    }

    const [user] = await knex('users').insert({
      name,
      email,
      password: await hash(password, 8),
    }).returning('*');

    res.json(user);
  }

  async showAll(req, res) {
    const users = await knex('users').select('*');
    res.json(users);
  }

  async show(req, res) {
    const { id } = req.params;

    const [user] = await knex('users').where({ id });

    res.json(user);
  }

  async delete(req, res) {
    const { id } = req.params;

    const user = await knex('users').where({ id }).del();

    res.json(user);
  }

  async update(req, res) {
    const { id } = req.params;
    const {
      name, email, password, avatar,
    } = req.body;

    const [userExists] = await knex('users').where({ id });

    if (!userExists) {
      throw new AppError('User not found', 404);
    }

    const [user] = await knex('users').where({ id }).update({
      name: name ?? userExists.name,
      email: email ?? userExists.email,
      password: await hash(password, 8) ?? userExists.password,
      avatar: avatar ?? userExists.avatar,
      update_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }).returning('*');

    res.json(user);
  }
}

module.exports = new UsersController();
