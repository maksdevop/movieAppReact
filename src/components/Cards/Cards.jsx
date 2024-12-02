import './Cards.css';
import Card from '../Card/Card';

function Cards({ movies, rateMovie, ratedMovies, isActiveRated }) {
  return (
    <Card
      movies={movies}
      ratedMovies={ratedMovies}
      isActiveRated={isActiveRated}
      rateMovie={rateMovie}
    />
  );
}

export default Cards;
