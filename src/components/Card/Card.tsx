import React, { FC, useEffect, useState } from 'react';
// import defultImg from 'public/404.jpg';
import './Card.css';
import { Rate } from 'antd';
import {
  truncateText,
  getGenreNames,
  getRatingColor,
  formatDate,
} from '../../utils/cardFunctions';

type Movie = {
  id: number;
  title: string;
  year: number;
  rating: number;
  backdrop_path?: string;
  original_title: string;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
  overview?: string;
};

type CardProps = {
  movies?: Movie[];
  ratedMovies?: Movie[];
  rateMovie?: (movie: Movie) => void;
};

type Genres = {
  id: number;
  name: string;
};

const Card: FC<CardProps> = ({
  movies = [],
  ratedMovies = [],
  rateMovie = () => {},
}) => {
  const [genres, setGenres] = useState<Genres[]>([]);
  const defultImg = '/404.jpg';

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer YOUR_BEARER_TOKEN',
      },
    };
    fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
      .then((res) => res.json())
      .then((res) => setGenres(res.genres))
      .catch((err) => console.error(err));
  }, []);

  const renderMovies = (movieList: Movie[]) => {
    return (
      <div className='card'>
        <div className='card__wrap'>
          {movieList.map((movie) => (
            <div className='card__item' key={movie.id}>
              <div className='card__img'>
                <img
                  src={
                    movie.backdrop_path
                      ? `https://image.tmdb.org/t/p/w200${movie.backdrop_path}`
                      : defultImg
                  }
                  alt='Movie Backdrop'
                />
              </div>
              <div className='card__info'>
                <div className='card__info-wrap'>
                  <h3 className='card__info-title'>{movie.original_title}</h3>
                  {movie.vote_average !== undefined && (
                    <div
                      className={`card__info-rating ${getRatingColor(
                        movie.vote_average,
                      )}`}
                    >
                      {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
                <p className='card__info-date'>
                  {formatDate(movie.release_date)}
                </p>
                <ul className='card__info_genres'>
                  {getGenreNames(genres, movie.genre_ids).map(
                    (genre, index) => (
                      <li key={index} className='card__info-genre'>
                        {genre}
                      </li>
                    ),
                  )}
                </ul>
                <p className='card__info-text'>
                  {truncateText(movie.overview, 30)}
                </p>
                <Rate
                  count={10}
                  allowHalf={true}
                  value={movie.rating}
                  onChange={(value) => rateMovie({ ...movie, rating: value })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {ratedMovies.length > 0 ? (
        renderMovies(ratedMovies)
      ) : movies.length > 0 ? (
        renderMovies(movies)
      ) : (
        <h2 style={{ color: 'black', textAlign: 'center', margin: '15px' }}>
          No movies found!
        </h2>
      )}
    </>
  );
};

export default Card;
