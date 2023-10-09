const { Router } = require('express');

const movieNotesController = require('../controllers/MovieNotesController');

const MovieNotesRouter = Router();

MovieNotesRouter.get('/', (req, res) => {
  res.json({ msg: 'Rota OK - notes' });
});

MovieNotesRouter.post('/create', movieNotesController.create);

module.exports = { MovieNotesRouter };
