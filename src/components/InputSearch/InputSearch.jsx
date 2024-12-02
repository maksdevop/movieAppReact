import { useCallback, useState } from 'react';
import '../InputSearch/InputSearch.css';
import debounce from 'lodash.debounce';
function InputSearch({ setCurrentPage, setSearchQuery }) {
  const [inputValue, setInputValue] = useState('');
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 1500),
    [],
  );

  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputValue(query);
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
}

export default InputSearch;
