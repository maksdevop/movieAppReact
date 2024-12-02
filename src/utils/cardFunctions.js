export const truncateText = (text, wordLimit) => {
  const words = text.split(' ');
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + ' ...'
    : text;
};

export const getRatingColor = (rate) => {
  if (rate >= 0 && rate < 3) return 'red';
  if (rate >= 3 && rate < 5) return 'orange';
  if (rate >= 5 && rate < 7) return 'yellow';
  return 'green';
};

export const getGenreNames = (genres, genreIds) => {
  return genreIds.map((id) => {
    const genre = genres.find((g) => g.id === id);
    return genre ? genre.name : 'Unknown';
  });
};

export const formatDate = (dateFilm) => {
  const date = new Date(dateFilm);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};
