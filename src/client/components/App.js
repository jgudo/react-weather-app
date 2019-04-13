import React, { Component } from 'react';
import moment from 'moment';
import 'moment-timezone';

import WeatherIcon from './WeatherIcon';
import DailyForecast from './DailyForecast';

import { 
  fetchCountryCode, 
  fetchWeather,
  fetchForecast, 
  fetchCurrentLocationAndWeather
} from '../api/api';

export default class WeatherApp extends Component {
  state = {
    country: '',
    city: '',
    lat: '',
    lon: '',
    tempCelcius: '',
    tempFahrenheit: '',
    isCelcius: true,
    weather: '',
    weatherDescription: '',
    humidity: '',
    windSpeed: '',
    weatherIconCode: '',
    searchQuery: '',
    searchStatus: undefined,
    countryCode: {},
    forecast:[],
    displayTime: '',
    zoneName: '',
    isSearching: false,
    loaded: false
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
    const data = await fetchCurrentLocationAndWeather();
    const forecast = await fetchForecast(data.weather.coord.lat, data.weather.coord.lon);

    this.setCurrentWeather(data.weather, data.location.city);
    
    this.setState({ 
      forecast: forecast.data,
      zoneName: forecast.timezone,
      loaded: true 
    });

    this.displayCurrentTime();
  };

  // Fetch country code json file
  setCountryCode = async () => {
    if ('localStorage' in window && localStorage.countryCode) {
      if (Object.keys(localStorage.countryCode).length === 0) {
        const countryCodeStore = JSON.parse(localStorage.getItem('countryCode'));
        this.setState(() => ({ countryCode: countryCodeStore }));
      } else {
        const countryCode = await fetchCountryCode();
        localStorage.setItem('countryCode', JSON.stringify(countryCode));

        this.setState(() => ({ countryCode }));
      }
    } 
  };

  setCurrentWeather = (data, city) => {
    this.setState({
      city,
      country: data.sys.country,
      lat: data.coord.lat,
      lon: data.coord.lon,
      tempCelcius: Math.round(data.main.temp),
      tempFahrenheit: Math.round((data.main.temp * (9/5)) + 32),
      weather: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      weatherDescription: data.weather[0].description,
      weatherIconCode: data.weather[0].icon,
      searchStatus: undefined,
      isSearching: false 
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

  // Display current time based on timezone
  displayCurrentTime = () => {
    if (this.state.zoneName) {
      const time = moment().tz(this.state.zoneName).format('LLLL');
      this.setState({ displayTime: time });
    }
  }

  // Http request Search <city,country> current weather
  searchCityWeather = async () => {
    try {
      const { searchQuery } = this.state;
      const weather = await fetchWeather(undefined, undefined, searchQuery);
      const forecast = await fetchForecast(weather.coord.lat, weather.coord.lon);

      this.setCurrentWeather(weather, weather.name);
      this.displayCurrentTime();
      this.setState({ 
        forecast: forecast.data,
        zoneName: forecast.timezone 
      });
    } catch (e) {
      this.setState({ searchStatus: 'City not found' });
    }
  };

  // Method that's being triggered for searching weather
  onSearchWeather = () => {
    this.setState({ 
      searchQuery: '',
      isSearching: true 
    });
    if (this.state.searchQuery.length !== 0) {
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
      city,
      country,
      countryCode,
      isCelcius,
      tempCelcius,
      tempFahrenheit,
      weatherDescription,
      windSpeed,
      humidity,
      displayTime,
      weatherIconCode,
      searchStatus,
      forecast,
      isSearching
    } = this.state;
    const countryFlagsUrl = 'https://www.countryflags.io/';

    return (
      <React.Fragment>
        {loaded ? (
          <div className={loaded ? 'container loaded' : null}>
            <div className="app-content">
              <div className="app-header">
                <h1>React JS Weather App</h1>
                <br/>
                <div className="field-wrapper">
                  <div className="text-field-wrapper">
                    <input 
                        className="form-control"
                        onChange={this.onSearchQueryChange}
                        onKeyDown={this.onKeyEnter}
                        placeholder="Search for <City,Country>"
                        type="text" 
                        value={searchQuery}
                    />
                  </div>
                  <button 
                      className="form-control"
                      onClick={this.onSearchWeather}
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="wrapper">
                {!isSearching ? (
                  <React.Fragment>
                    <div className="weather">
                      <div className="weather-wrapper">
                        <WeatherIcon iconCode={weatherIconCode} />
                        <div className="temperature-control">
                          <h1 className="weather-temp">
                            {isCelcius ? `${tempCelcius} °C` : `${tempFahrenheit} °F`} 
                          </h1>
                            <div 
                                className="temperature-toggle" 
                                onClick={this.onToggleFahrenheit}
                                style={{
                                  color: isCelcius ? 'rgba(255, 255, 255, .7)' : '#adff2f'
                                }}
                            >
                              <span>{isCelcius ? '°F' : '°C' }</span>
                            </div>
                        </div>
                      </div>
                      <div className="temperature-info">
                        <div className="location">
                          <h2>{city}, {countryCode[country]}</h2>
                          <img src={`${countryFlagsUrl}/${country}/shiny/64.png`} alt=""/>
                        </div>
                        <h4 style={{textTransform: 'capitalize'}}>
                          <span>Weather:</span> {weatherDescription}
                        </h4>
                        <h4><span>Wind Speed:</span> {windSpeed} km/h</h4>
                        <h4><span>Humidity:</span> {humidity}%</h4>
                        <h4><span>Date:</span> {displayTime}</h4>
                      </div>
                    </div>
                    {forecast.length !== 0 && (
                      <DailyForecast 
                          forecast={forecast} 
                          isCelcius={isCelcius}
                      />
                    )}
                  </React.Fragment>
                ) : (
                  <div></div>
                )}
                {searchStatus && (   
                  <p>{searchStatus}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={'loading'}>
            <div className='loader'></div>
          </div>
        )}
      </React.Fragment>
    );
  }
}