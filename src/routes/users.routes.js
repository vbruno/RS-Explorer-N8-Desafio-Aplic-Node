const { Router } = require('express');

const usersRouter = Router();

usersRouter.get('/', (request, response) => response.json({ message: 'Rota Usuário' }));

module.exports = { usersRouter };
