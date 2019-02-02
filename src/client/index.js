import React from 'react';
import ReactDOM from 'react-dom';
import WeatherApp from './components/App';

import 'normalize.css/normalize.css';
import './styles/style.scss';
//import 'weather-icons/css/weather-icons.min.css';
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Roboto']
  }
});

ReactDOM.render(<WeatherApp />, document.getElementById('root'));


