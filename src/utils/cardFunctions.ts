type Genre = {
  id: number;
  name: string;
};

export const truncateText = (text: string = '', wordLimit: number) => {
  const words = text.split(' ');
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + ' ...'
    : text;
};

export const getRatingColor = (rate: number) => {
  if (rate >= 0 && rate < 3) return 'red';
  if (rate >= 3 && rate < 5) return 'orange';
  if (rate >= 5 && rate < 7) return 'yellow';
  return 'green';
};

export const getGenreNames = (
  genres: Genre[],
  genreIds?: number[],
): string[] => {
  if (!genreIds) {
    return [];
  }

  return genreIds.map((id: number) => {
    const genre = genres.find((g) => g.id === id);
    return genre ? genre.name : 'Unknown';
  });
};

export const formatDate = (dateFilm: string = '') => {
  const date = new Date(dateFilm);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};
