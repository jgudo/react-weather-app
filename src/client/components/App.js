import React, { Component } from 'react';
import moment from 'moment';
import 'moment-timezone';

import DailyForecast from './DailyForecast';
import Weather from './Weather';
import Header from './Header';
import Loader from './Loader';
import SearchEmpty from './SearchEmpty';

import { 
  fetchCountryCode, 
  fetchForecast, 
  fetchCurrentLocationAndWeather
} from '../api/api';

export default class WeatherApp extends Component {
  state = {
    country: '',
    countryCode: {},
    city: '',
    displayTime: '',
    forecast:[],
    humidity: '',
    isCelcius: true,
    isSearching: false,
    lat: '',
    loaded: false,
    lon: '',
    tempCelcius: '',
    tempFahrenheit: '',
    weather: '',
    weatherDescription: '',
    windSpeed: '',
    weatherIconCode: '',
    searchQuery: '',
    searchStatus: undefined,
    zoneName: ''
  };

  componentDidMount() {
    try {
      this.setCountryCode();
      this.fetchUserLocation();
    } catch (e) {
      console.log('An error occured', e);
    }
  }

  fetchUserLocation = async () => {
    const weather = await fetchCurrentLocationAndWeather();
    
    this.setCurrentWeather(weather);
  };

  // Fetch country code json file
  setCountryCode = async () => {
    if (localStorage.countryCode && Object.keys(localStorage.countryCode).length === 0) {
      const countryCodeStore = JSON.parse(localStorage.getItem('countryCode'));
      this.setState(() => ({ countryCode: countryCodeStore }));
    } else {
      const countryCode = await fetchCountryCode();
      localStorage.setItem('countryCode', JSON.stringify(countryCode));

      this.setState(() => ({ countryCode }));
    } 
  };

  setCurrentWeather = (weather) => {
    this.setState({
      city: weather.city_name,
      country: weather.country_code,
      lat: weather.lat,
      lon: weather.lon,
      tempCelcius: Math.round(weather.data[0].temp),
      tempFahrenheit: Math.round((weather.data[0].temp * (9/5)) + 32),
      weather: weather.data[0].weather.description,
      humidity: weather.data[0].rh,
      windSpeed: weather.data[0].wind_spd.toFixed(2),
      weatherDescription: weather.data[0].weather.description,
      weatherIconCode: weather.data[0].weather.icon,
      displayTime: weather.timezone ? moment().tz(weather.timezone).format('LLLL') : '',
      searchStatus: undefined,
      isSearching: false, 
      forecast: weather.data,
      zoneName: weather.timezone,
      loaded: true 
    });
  }

  // Search query handler
  onSearchQueryChange = (e) => {
    let input = e.target.value.toLowerCase().trimStart();
    this.setState(() => ({
      searchQuery: input
    }));
  }

  // Trigger weather search on enter
  onKeyEnter = (e) => {
    if(e.keyCode == 13) {
      this.onSearchWeather();
    }
  }

  // Http request Search <city,country> current weather
  searchCityWeather = async () => {
    try {
      const weather = await fetchForecast(this.state.searchQuery);

      this.setCurrentWeather(weather);
    } catch (e) {
      this.setState({ 
        searchStatus: 'Location not found',
        isSearching: false 
      });
    }
  };

  // Method that's being triggered for searching weather
  onSearchWeather = () => {
    const { searchQuery, isSearching } = this.state;

    if (searchQuery.length !== 0 && !isSearching) {
      this.setState({ 
        isSearching: true,
        searchStatus: undefined 
      });
      this.searchCityWeather();
    }
  };

  // Celcius/Fahrenheit toggler
  onToggleFahrenheit = () => {
    this.setState({ isCelcius: !this.state.isCelcius });
  };

  /* eslint-disable no-return-assign */
  render() {
    const { 
      loaded,
      searchQuery,
      isCelcius,
      searchStatus,
      forecast,
      isSearching
    } = this.state;
   
    return (
      <React.Fragment>
        {loaded ? (
          <div className="container">
            <Header 
                isSearching={isSearching}
                onChange={this.onSearchQueryChange}
                onKeyDown={this.onKeyEnter}
                onSearchWeather={this.onSearchWeather}
                searchQuery={searchQuery}
            />
            <div className="app-content">
              {(!isSearching && !searchStatus) && (
                <React.Fragment>
                  <Weather 
                      onToggle={this.onToggleFahrenheit}
                      weather={this.state} 
                  />
                  {forecast.length !== 0 && (
                    <DailyForecast 
                        forecast={forecast} 
                        isCelcius={isCelcius}
                    />
                  )}
                </React.Fragment>
              )}
              {(isSearching && !searchStatus) && (
                <Loader />
              )}
              {searchStatus && (   
                <SearchEmpty searchStatus={searchStatus}/>
              )}
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </React.Fragment>
    );
  }
}