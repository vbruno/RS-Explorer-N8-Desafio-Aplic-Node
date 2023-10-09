const { Router } = require('express');
const { usersRouter } = require('./users.routes');
const { MovieNotesRouter } = require('./notes.routes');

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/notes', MovieNotesRouter);

module.exports = { routes };
