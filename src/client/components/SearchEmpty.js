import React from 'react';

const SearchEmpty = ({ searchStatus }) => (
  <div className="search-empty">
    <h2>{searchStatus}</h2>
    <p>
    Try making your search specific by adding the country. 
    Example: [ Arayat, Philippines ]
    </p>
  </div>
);

export default SearchEmpty;
