import { useCallback, useState, FC, ChangeEvent, useEffect } from 'react';
import '../InputSearch/InputSearch.css';
import debounce from 'lodash.debounce';
import React from 'react';

type InputSearchProps = {
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
};

const InputSearch: FC<InputSearchProps> = ({
  setCurrentPage,
  setSearchQuery,
}) => {
  const [inputValue, setInputValue] = useState<string>(() => {
    return sessionStorage.getItem('searchInput') || '';
  });
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 1500),
    [],
  );

  useEffect(() => {
    const savedInput = sessionStorage.getItem('searchInput');
    if (savedInput) {
      setInputValue(savedInput);
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    sessionStorage.setItem('searchInput', query);
    debouncedSearch(query);
  };

  return (
    <form className='input'>
      <input
        type='text'
        placeholder='Type to search...'
        value={inputValue}
        onChange={handleInputChange}
      />
    </form>
  );
};

export default InputSearch;
