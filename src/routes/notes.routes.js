const { Router } = require('express');

const movieNotesController = require('../controllers/MovieNotesController');

const MovieNotesRouter = Router();

MovieNotesRouter.get('/', (req, res) => {
  res.json({ msg: 'Rota OK - notes' });
});

MovieNotesRouter.post('/create', movieNotesController.create);
MovieNotesRouter.get('/showAll', movieNotesController.showAll);
MovieNotesRouter.get('/:id', movieNotesController.index);
MovieNotesRouter.delete('/:id', movieNotesController.delete);
MovieNotesRouter.put('/:id', movieNotesController.update);

module.exports = { MovieNotesRouter };
