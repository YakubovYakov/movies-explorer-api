const router = require('express').Router();

const {
  validateMovieId,
  validateMovie,
} = require('../middlewares/validation');

const {
  getMovies,
  createMovies,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateMovie, createMovies);
router.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = router;
