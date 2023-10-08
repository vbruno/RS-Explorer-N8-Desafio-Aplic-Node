const { Router } = require('express');

const usersController = require('../controllers/UsersController');

const usersRouter = Router();

usersRouter.post('/create', usersController.create);
usersRouter.get('/showAll', usersController.showAll);
usersRouter.get('/:id', usersController.show);
usersRouter.delete('/:id', usersController.delete);
usersRouter.put('/:id', usersController.update);

module.exports = { usersRouter };
