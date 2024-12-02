import { useEffect, useState } from 'react';
import './Card.css';
import { Rate } from 'antd';
import {
  truncateText,
  getGenreNames,
  getRatingColor,
  formatDate,
} from '../../utils/cardFunctions';

function Card({ movies, rateMovie, ratedMovies, isActiveRated }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YWNlMTEwYTU1YmRmNmUzMjg2YjZiZTNmZTgyZTA1ZCIsIm5iZiI6MTczMjQ1MDc0OS4yNjk3OTQ3LCJzdWIiOiI2NzNiODRhMjRiOGVhMDYxZjUzYWI2NTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.z0gZ2N7gxkcruqv0gGfG18niwb9K5FujcoKNjwf7y_M',
      },
    };
    fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
      .then((res) => res.json())
      .then((res) => setGenres(res.genres))
      .catch((err) => console.error(err));
  }, []);

  const renderMovies = (movieList) => {
    return (
      <div className='card'>
        <div className='card__wrap'>
          {movieList.map((movie) => (
            <div className='card__item' key={movie.id}>
              <div className='card__img'>
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.backdrop_path}`}
                  alt='Movie Backdrop'
                />
              </div>
              <div className='card__info'>
                <div className='card__info-wrap'>
                  <h3 className='card__info-title'>{movie.original_title}</h3>
                  <div
                    className={`card__info-rating ${getRatingColor(movie.vote_average)}`}
                  >
                    {movie.vote_average.toFixed(1)}
                  </div>
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
                  value={isActiveRated ? movie.rating : movie.rating}
                  onChange={(value) =>
                    !isActiveRated && rateMovie({ ...movie, rating: value })
                  }
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
      {isActiveRated ? (
        ratedMovies.length > 0 ? (
          renderMovies(ratedMovies)
        ) : (
          <h2 style={{ color: 'black', textAlign: 'center', margin: '15px' }}>
            No rated movies!
          </h2>
        )
      ) : (
        renderMovies(movies)
      )}
    </>
  );
}

export default Card;
