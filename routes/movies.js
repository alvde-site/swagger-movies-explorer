const moviesRouter = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const { validatePostMoviesRouter, validateDeleteMovie } = require('../middlewares/validations');

moviesRouter.get('/', getMovies);

moviesRouter.post('/', validatePostMoviesRouter, createMovie);

moviesRouter.delete('/:id', validateDeleteMovie, deleteMovie);

module.exports = moviesRouter;
