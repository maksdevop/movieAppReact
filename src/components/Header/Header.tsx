import React, { FC } from 'react';
import './Header.css';
import InputSearch from '../InputSearch/InputSearch.tsx';

type HeaderProps = {
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  isActiveRated: boolean;
  isActiveSearch: boolean;
  toggleActiveSearch: () => void;
  toggleActiveRated: () => void;
};

const Header: FC<HeaderProps> = ({
  setCurrentPage,
  setSearchQuery,
  isActiveRated,
  isActiveSearch,
  toggleActiveSearch,
  toggleActiveRated,
}) => {
  return (
    <div className='header'>
      <div className='tabs'>
        <button
          onClick={toggleActiveSearch}
          className={`tabs__search ${isActiveSearch ? 'active' : ''}`}
        >
          Search
        </button>
        <button
          onClick={toggleActiveRated}
          className={`tabs__search ${isActiveRated ? 'active' : ''}`}
        >
          Rated
        </button>
      </div>
      {isActiveSearch && (
        <InputSearch
          setSearchQuery={setSearchQuery}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Header;
