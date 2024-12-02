import { useEffect, useState } from 'react';

import './App.css';
import Header from './components/Header/Header.jsx';
import Cards from './components/Cards/Cards.jsx';
import {
  fetchGuestSession,
  searchFilms,
  getFilms,
  rateMovie,
} from './utils/api.js';

import { Pagination, Spin } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import { TailSpin } from 'react-loader-spinner';

function App() {
  const API_KEY = '5ace110a55bdf6e3286b6be3fe82e05d';
  const GUEST_SESSION_URL = `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${API_KEY}`;
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRated, setCurrentPageRated] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalPagesRated, setTotalPagesRated] = useState(0);
  const [guestSessionId, setGuestSessionId] = useState(null);
  const [isActiveSearch, setIsActiveSearch] = useState(true);
  const [isActiveRated, setIsActiveRated] = useState(false);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [rating, setRating] = useState(null);

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
    if (isActiveRated && guestSessionId && rating > 0) {
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
}

export default App;
