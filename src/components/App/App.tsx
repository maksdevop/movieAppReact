import { FC, useEffect, useState } from 'react';
import React from 'react';

import './App.css';
import Header from '../Header/Header.jsx';
import Cards from '../Cards/Cards.jsx';
import {
  fetchGuestSession,
  searchFilms,
  getFilms,
  rateMovie,
} from '../../utils/api.ts';

import { Pagination, Spin } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import { TailSpin } from 'react-loader-spinner';

type Movie = {
  id: number;
  title: string;
  year: number;
  rating: number;
  backdrop_path?: string;
  original_title: string;
  vote_average?: number;
  release_date: string;
  genre_ids: number[];
  overview: string;
};

const App: FC = () => {
  const API_KEY = '5ace110a55bdf6e3286b6be3fe82e05d';
  const GUEST_SESSION_URL = `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API_KEY}`;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageRated, setCurrentPageRated] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalPagesRated, setTotalPagesRated] = useState<number>(0);
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);
  const [isActiveSearch, setIsActiveSearch] = useState<boolean>(true);
  const [isActiveRated, setIsActiveRated] = useState<boolean>(false);
  const [ratedMovies, setRatedMovies] = useState<Movie[]>([]);
  const [rating, setRating] = useState<number | null>(null);

  const toggleActiveSearch = () => {
    setIsActiveSearch(true);
    setIsActiveRated(false);
  };

  const toggleActiveRated = () => {
    setIsActiveSearch(false);
    setIsActiveRated(true);
  };

  useEffect(() => {
    fetchGuestSession(setGuestSessionId);
  }, [GUEST_SESSION_URL]);

  useEffect(() => {
    const url = searchQuery
      ? `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&language=en-US&page=${currentPage}&api_key=${API_KEY}`
      : `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${currentPage}&api_key=${API_KEY}`;

    searchFilms(url, setMovies, setIsLoading, setTotalPages);
  }, [currentPage, searchQuery]);

  const handlePageChange = (page) => {
    isActiveSearch ? setCurrentPage(page) : setCurrentPageRated(page);
  };

  useEffect(() => {
    if (isActiveRated && guestSessionId && rating && rating > 0) {
      getFilms(
        guestSessionId,
        currentPageRated,
        setRatedMovies,
        setTotalPagesRated,
      );
    }
  }, [isActiveRated, guestSessionId, rating, currentPageRated]);

  return (
    <div>
      <Online polling={{ interval: 60000, timeout: 15000 }}>
        <Header
          setSearchQuery={setSearchQuery}
          setCurrentPage={setCurrentPage}
          toggleActiveSearch={toggleActiveSearch}
          toggleActiveRated={toggleActiveRated}
          isActiveSearch={isActiveSearch}
          isActiveRated={isActiveRated}
        />
        {isLoading && (
          <div className='loading'>
            <Spin size='large' />
          </div>
        )}
        {isActiveSearch && (
          <Cards
            movies={movies}
            rateMovie={(movie) =>
              rateMovie(
                movie,
                guestSessionId,
                setMovies,
                setRatedMovies,
                setRating,
                movies,
              )
            }
          />
        )}

        {isActiveRated && (
          <Cards isActiveRated={isActiveRated} ratedMovies={ratedMovies} />
        )}

        {movies.length && (
          <Pagination
            align='center'
            current={isActiveSearch ? currentPage : currentPageRated}
            pageSize={1}
            total={isActiveSearch ? totalPages : totalPagesRated}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        )}
      </Online>
      <Offline polling={{ interval: 60000, timeout: 15000 }}>
        <h1 className='internet-title'>No internet connection</h1>
        <div className='interten_spinner'>
          <TailSpin
            height='80'
            width='80'
            color='#4fa94d'
            ariaLabel='loading'
          />
        </div>
      </Offline>
    </div>
  );
};

export default App;
