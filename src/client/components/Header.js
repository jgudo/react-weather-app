import React, { useRef } from 'react';

const Header = ({ 
  onChange, 
  onKeyDown, 
  searchQuery, 
  onSearchWeather,
  isSearching 
}) => {
  const header = useRef(null);
  const onFocusChange = (e) => {
    e.target.select();
  };

  const toggleSearchBar = () => {
    header.current.classList.toggle('active');
  };

  return (
    <div 
        className="app-header"
        ref={header}
    >
      <div className="header-wrapper">
        <div className="logo">
          <h1>Kaulapan</h1>
        </div>
        <div 
            className="search-toggle" 
            onClick={toggleSearchBar}
        />
        <div className="field-wrapper">
          <div className="text-field-wrapper">
            <input 
                className="form-control"
                onChange={onChange}
                onFocus={onFocusChange}
                onKeyDown={onKeyDown}
                placeholder="Search for city, country"
                readOnly={isSearching}
                type="text" 
                value={searchQuery}
            />
          </div>
          <button 
              className="search-button"
              disabled={isSearching}
              onClick={onSearchWeather}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
