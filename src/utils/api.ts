import { API_KEY, GUEST_SESSION_URL } from './apiKey';
const timeId = localStorage.getItem('timeSessionId');

export const fetchGuestSession = async (setGuestSessionId) => {
  const sessionId = localStorage.getItem('sessionId');
  const timeId = localStorage.getItem('timeSessionId');

  if (!sessionId || (timeId && Date.now() - Number(timeId) > 3600000)) {
    try {
      const response = await fetch(GUEST_SESSION_URL);
      const data = await response.json();
      localStorage.setItem('sessionId', data.guest_session_id);
      localStorage.setItem('timeSessionId', String(Date.now()));
      setGuestSessionId(data.guest_session_id);
      console.log(data.guest_session_id);
    } catch (error) {
      console.error('Ошибка при создании гостевой сессии:', error);
    }
  } else if (sessionId) {
    setGuestSessionId(sessionId);
    console.log(sessionId);
  } else {
    console.log('net');
  }
};

export const searchFilms = (url, setMovies, setIsLoading, setTotalPages) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      const savedRatings = JSON.parse(localStorage.getItem('ratings') || '{}');
      const moviesWithRatings = res.results.map((movie) => ({
        ...movie,
        rating: savedRatings[movie.id] || 0,
      }));

      setMovies(moviesWithRatings);
      const pages = res.total_pages > 500 ? 500 : res.total_pages;
      setTotalPages(pages);
      setIsLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setIsLoading(false);
    });
};

export const getFilms = (
  guestSessionId,
  currentPageRated,
  setRatedMovies,
  setTotalPagesRated,
) => {
  if (!guestSessionId) {
    console.error('guestSessionId is not set.');
    return;
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YWNlMTEwYTU1YmRmNmUzMjg2YjZiZTNmZTgyZTA1ZCIsIm5iZiI6MTczMjYzNzQ0Ny4wODgzNzg3LCJzdWIiOiI2NzNiODRhMjRiOGVhMDYxZjUzYWI2NTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.dp90KNhHrbG9lDbTKKOPUoCq5Hhz6aT0HL7vUGhR7mI',
    },
  };

  const url = `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?language=en-US&page=${currentPageRated}&sort_by=created_at.asc`;

  fetch(url, options)
    .then((res) => {
      if (!res.ok) {
        return;
      }
      return res.json();
    })
    .then((res) => {
      setRatedMovies(res.results);
      setTotalPagesRated(res.total_pages);
    })
    .catch((err) => {
      console.error('Ошибка при получении оцененных фильмов:', err);
    });
};

export const rateMovie = (
  movie,
  guestSessionId,
  setMovies,
  setRatedMovies,
  setRating,
  movies,
  ratedMovies,
) => {
  const { id, rating } = movie;
  if (rating > 0) {
    const url = `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionId}`;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        value: rating,
        id: movie.id,
      }),
    };

    fetch(url, options)
      .then((response) => response.json())
      .then(() => {
        setMovies((prevMovies) =>
          prevMovies.map((films) =>
            films.id === movie.id ? { ...films, rating } : films,
          ),
        );
        setRatedMovies((prevRatedMovies) => {
          const updatedRatedMovies = [...prevRatedMovies, { ...movie, rating }];
          // Сохранение оцененных фильмов в localStorage
          localStorage.setItem(
            'ratedMovies',
            JSON.stringify(updatedRatedMovies),
          );
          return updatedRatedMovies;
        });
        setRating(rating);
        const savedRatings = JSON.parse(
          localStorage.getItem('ratings') || '{}',
        );
        savedRatings[movie.id] = rating;
        localStorage.setItem('ratings', JSON.stringify(savedRatings));
      })
      .catch((err) => {
        console.error('Ошибка при оценке фильма:', err);
      });
  }
  if (rating === 0) {
    const url = `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionId}`;
    const options = {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YWNlMTEwYTU1YmRmNmUzMjg2YjZiZTNmZTgyZTA1ZCIsIm5iZiI6MTczMjYzNzQ0Ny4wODgzNzg3LCJzdWIiOiI2NzNiODRhMjRiOGVhMDYxZjUzYWI2NTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.dp90KNhHrbG9lDbTKKOPUoCq5Hhz6aT0HL7vUGhR7mI',
      },
    };
    fetch(url, options)
      .then((res) => res.json())
      .then(() => {
        setRatedMovies((prevRatedMovies) => {
          const updatedRatedMovies = prevRatedMovies.filter(
            (movie) => movie.id !== id,
          );
          const updatedMovies = movies.map((movie) => {
            if (movie.id === id) {
              const { rating, ...movieWithoutRating } = movie;
              return movieWithoutRating;
            }
            return movie;
          });
          const savedRatings = JSON.parse(
            localStorage.getItem('ratings') || '{}',
          );
          delete savedRatings[movie.id];
          localStorage.setItem('ratings', JSON.stringify(savedRatings));
          setMovies(updatedMovies);
          setRating(null);

          // Обновление localStorage после удаления фильма
          localStorage.setItem(
            'ratedMovies',
            JSON.stringify(updatedRatedMovies),
          );

          return updatedRatedMovies.length ? updatedRatedMovies : [];
        });
      })
      .catch((err) => console.error(err));
  }
};
