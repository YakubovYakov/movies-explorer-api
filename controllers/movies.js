const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
// const movie = require('../models/movie');

// Получить все фильмы
const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .select('-owner')
    .then((movies) => res.status(200)
      .send(movies))
    .catch(next);
};

const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(200)
      .send({
        _id: movie._id,
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailer: movie.trailer,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
        thumbnail: movie.thumbnail,
        movieId: movie.movieId,
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(err.message);
      } else {
        next(err);
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie === null) {
        return next(new NotFoundError('Фильм с указанным id не найдена'));
      }
      if (!(movie.owner.toString() === userId)) {
        return next(new ForbiddenError('Нет прав для удаления данной карточки'));
      }
      return Movie.deleteOne(movie).then((data) => res.send(data))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
          } else {
            next(err);
          }
        })
        .catch(next);
    });
};

module.exports = {
  getMovies,
  createMovies,
  deleteMovie,
};
