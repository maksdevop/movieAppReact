import './Cards.css';
import Card from '../Card/Card';
import React, { FC } from 'react';

type Movie = {
  id: number;
  title: string;
  year: number;
  rating: number;
};

type CardsProps = {
  isActiveRated?: boolean;
  ratedMovies?: Movie[];
  rateMovie?: (movie: Movie) => void;
  movies?: Movie[];
};

const Cards: FC<CardsProps> = ({
  movies = [],
  rateMovie = () => {},
  ratedMovies = [],
  isActiveRated = false,
}) => {
  return (
    <Card
      movies={movies}
      ratedMovies={ratedMovies}
      isActiveRated={isActiveRated}
      rateMovie={rateMovie}
    />
  );
};

export default Cards;
