import React, { Component } from 'react';
import moment from 'moment';
import 'moment-timezone';

import WeatherIcon from './WeatherIcon';

import { 
  fetchCountryCode, 
  fetchWeather, 
  getTimezone,
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
    gmtOffset: '',
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
    const timezone = await getTimezone(data.weather.coord.lat, data.weather.coord.lon);

    this.setCurrentWeather(data.weather, data.location.city);
    
    this.setState({ 
      gmtOffset: timezone.gmtOffset,
      dateAndTime: timezone.formatted,
      zoneName: timezone.zoneName,
      loaded: true 
    });

    this.displayCurrentTime();
  };

  // Fetch country code json file
  setCountryCode = () => {
    if ('localStorage' in window) {
      if (localStorage.countryCode) {
        const countryCodeStore = JSON.parse(localStorage.getItem('countryCode'));
        this.setState(() => ({ countryCode: countryCodeStore }));
      } else {
        const countryCode = fetchCountryCode();
        localStorage.setItem('countryCode', JSON.stringify(countryCode));

        this.setState(() => ({ countryCode }));
      }
    }
  }

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
  onKeyStroke = (e) => {
    if(e.keyCode == 13) {
      this.onSearchWeather();
    }
  }

  // Display current time based on timezone
  displayCurrentTime = () => {
    if (this.state.zoneName) {
      const time = moment().tz(this.state.zoneName).format('LLL');
      this.setState({ displayTime: time });
    }
  }

  // Http request Search <city,country> current weather
  searchCityWeather = async () => {
    try {
      const { searchQuery } = this.state;
      const weather = await fetchWeather(undefined, undefined, searchQuery);
      const timezone = await getTimezone(weather.coord.lat, weather.coord.lon);
        
      this.setCurrentWeather(weather, weather.name);
      this.displayCurrentTime();
      this.setState({ 
        gmtOffset: timezone.gmtOffset,
        dateAndTime: timezone.formatted,
        zoneName: timezone.zoneName 
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
  onControlClick = () => {
    const ball = this.toggleBall;
    this.setState({ isCelcius: !this.state.isCelcius });
    ball.classList.toggle('isFahrenheit');
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
      isSearching
    } = this.state;
    const countryFlagsUrl = 'https://www.countryflags.io/';

    return (
      <React.Fragment>
        {loaded ? (
          <div className={loaded ? 'container loaded' : null}>
            <div className="app-content">
              <div className="wrapper">
                <div className="app-header">
                  <h1>React JS Weather App</h1>
                  <br/>
                  <div className="field-wrapper">
                    <div className="text-field-wrapper">
                      <input 
                          className="form-control"
                          onChange={this.onSearchQueryChange}
                          onKeyDown={this.onKeyStroke}
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
                {!isSearching ? (
                  <div>
                    <div className="location">
                      <h3>{city}, {countryCode[country]}</h3>
                      <img src={`${countryFlagsUrl}/${country}/shiny/64.png`} alt=""/>
                    </div>
                    <div className="weather">
                      <WeatherIcon iconCode={weatherIconCode} />
                      <div className="temperature-info">
                        <h1>{isCelcius ? `${tempCelcius} °C` : `${tempFahrenheit} °F`} </h1>
                        <h4 style={{textTransform: 'capitalize'}}>
                          Weather: {weatherDescription}
                        </h4>
                        <h4>Wind Speed: {windSpeed} km/h</h4>
                        <h4>Humidity: {humidity}%</h4>
                        <div className="display-time">
                          <h2>{displayTime}</h2>
                          <span>{city}'s current date and time</span>
                        </div>
                        <div 
                            className="temperature-control" 
                            ref={node => this.toggleBall = node}
                        >
                          <span>°C</span>
                            <div 
                                className="temperature-toggle" 
                                onClick={this.onControlClick}
                            >
                              <div className="toggle-ball"/>
                            </div>
                          <span>°F</span>
                        </div>
                      </div>
                    </div>
                  </div>
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