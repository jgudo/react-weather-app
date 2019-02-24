import React, {Component} from 'react';
import moment from 'moment';
import 'moment-timezone';

const owmEndPoint = 'https://api.openweathermap.org/data/2.5/weather?';
const owmKey = process.env.OWM_KEY;
const timezoneDbApiKey = process.env.TIMEZONE_DB_API_KEY;
const ipdataApiKey = process.env.IPDATA_API_KEY;
const ipdataEndpoint = `https://api.ipdata.co/?api-key=${ipdataApiKey}`;
const timezoneDbEndpoint = `https://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneDbApiKey}&format=json&by=position&`;
const countryFlagsUrl = 'https://www.countryflags.io/';

const wiIcons = {
  "01d": "wi-day-sunny",
  "01n": "wi-night-clear",
  "02d": "wi-day-sunny-overcast",
  "02n": "wi-night-alt-partly-cloudy",
  "03d": "wi-day-cloudy",
  "03n": "wi-night-alt-cloudy",
  "04d": "wi-day-cloudy-high",
  "04n": "wi-night-alt-cloudy-high",
  "09d": "wi-day-sprinkle",
  "09n": "wi-night-alt-sprinkle",
  "10d": "wi-day-rain",
  "10n": "wi-night-alt-rain",
  "11d": "wi-day-thunderstorm",
  "11n": "wi-night-alt-thunderstorm",
  "13d": "wi-day-snow",
  "13n": "wi-night-alt-snow",
  "50d": "wi-day-fog",
  "50n": "wi-night-fog"
};

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
    displayTime: ''
  };

  componentWillMount() {
    const fetchUserLocation = async () => {
      const data =  await this.fetchCurrentLocation();
      const tempRequest = await fetch(`${owmEndPoint}lat=${data.latitude}&lon=${data.longitude}&APPID=${owmKey}&units=metric`);
      const temp = await tempRequest.json();  
      

      if(temp.cod == 200) {
        this.setCurrentWeather(temp, data.city);
        const timeZone = await this.setCurrentTime(temp.coord.lat, temp.coord.lon);
        this.setState(() => ({ 
          gmtOffset: timeZone.gmtOffset,
          dateAndTime: timeZone.formatted,
          zoneName: timeZone.zoneName 
        }));
        this.displayCurrentTime();
      }
    };

    try {
      this.setCountryCode();
      fetchUserLocation();
    } catch(e) {
      console.log('An error occured');
    }
  }

  fetchCurrentLocation = async () => {
    const requestLocation = await fetch(ipdataEndpoint);
    return await requestLocation.json();
  }

  setCountryCode = async () => {
    if('localStorage' in window) {
       if(localStorage.countryCode) {
         const getCountryCode = localStorage.getItem('countryCode');
         const countryCode = JSON.parse(getCountryCode);
         this.setState(() => ({ countryCode }));
       } else {
          const requestCountryCode = await fetch('/country-code.json');
          const countryCode = await requestCountryCode.json();
          localStorage.setItem('countryCode', JSON.stringify(countryCode));

          this.setState(() => ({countryCode}));
       }
    }
    

  }

  setCurrentWeather = (data, city) => {
    this.setState(() => ({
      city: city,
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
      searchStatus: undefined
    }));
  }

  setCurrentTime = async(lat, lon) => {
    const requestTimeZone = await fetch(`${timezoneDbEndpoint}&lat=${lat}&lng=${lon}`);
    return await requestTimeZone.json();
  };

  onSearchQueryChange = (e) => {
    let input = e.target.value.toLowerCase().trimStart();
    this.setState(() => ({
      searchQuery: input
    }));
  }

  onKeyStroke = (e) => {
    if(e.keyCode == 13) {
      this.onSearchWeather();
    }
  }

  displayCurrentTime = () => {
    try {
      const time = moment().tz(this.state.zoneName).format('LLL');
      this.setState(() => ({ displayTime: time }));
    } catch(e) {
      console.log('cannot set time for', this.state.zoneName);
    }
      
  }

  onSearchWeather = () => {
    this.setState(() => ({ searchQuery: '' }));
    const searchCityWeather = async () => {
      const weatherRequest = await fetch(`${owmEndPoint}q=${this.state.searchQuery}&units=metric&APPID=${owmKey}`);
      if(weatherRequest.status == 200) {
        const weather = await weatherRequest.json();

        if(weather.cod == 200) {
          this.setCurrentWeather(weather, weather.name);
          this.displayCurrentTime();
          const timeZone = await this.setCurrentTime(weather.coord.lat, weather.coord.lon);
          this.setState(() => ({ 
            gmtOffset: timeZone.gmtOffset,
            dateAndTime: timeZone.formatted,
            zoneName: timeZone.zoneName 
          }));
        }
      }
      else {
        this.setState(() => ({
          searchStatus: 'City not found'
        }));
      }
    }

    try {
      if(this.state.searchQuery.length !== 0) {
        searchCityWeather();
      }
    } catch(e) {
      console.log('Unabled to fetch weather');
    } 
  }

  onControlClick = () => {
    const ball = this.toggleBall;
    this.setState((prevState) => ({ isCelcius: !prevState.isCelcius }))
    ball.classList.toggle('isFahrenheit');
  };


  render() {

    return(
      <div className="container">
        <div className="app-content">
            <div className="wrapper">
              <div className="app-header">
                <h1>React JS Weather App</h1>
                <br/>
                <div className="field-wrapper">
                  <div className="text-field-wrapper">
                    <input type="text" 
                        onChange={this.onSearchQueryChange}
                        value={this.state.searchQuery}
                        placeholder="Search for <City,Country>"
                        className="form-control"
                        onKeyDown={this.onKeyStroke}
                    />
                    <div></div>
                  </div>
                    <button 
                      onClick={this.onSearchWeather}
                      className="form-control"
                    >
                      Search
                    </button>
                </div>
              </div>
            {!this.state.searchStatus ? (   
                <div>
                  <div className="location">
                    <h3>{this.state.city}, {this.state.countryCode[this.state.country]}</h3>
                    <img src={`${countryFlagsUrl}/${this.state.country}/shiny/64.png`} alt=""/>
                  </div>
                  <div className="weather">
                    <i className={`wi ${wiIcons[this.state.weatherIconCode]}`}></i>
                    <div className="temperature-info">
                      <h1>{this.state.isCelcius ? this.state.tempCelcius + ' °C' : this.state.tempFahrenheit + ' °F'} </h1>
                      <h4 style={{textTransform: 'capitalize'}}>Weather: {this.state.weatherDescription}</h4>
                      <h4>Wind Speed: {this.state.windSpeed} km/h</h4>
                      <h4>Humidity: {this.state.humidity}%</h4>
                      <div className="display-time">
                        <h2>{this.state.displayTime}</h2>
                        <span>{this.state.city}'s current date and time</span>
                      </div>
                      <div className="temperature-control" ref={(node) => this.toggleBall = node}>
                         <span>°C</span>
                          <div className="temperature-toggle" onClick={this.onControlClick}>
                            <div className="toggle-ball"></div>
                          </div>
                         <span>°F</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>{this.state.searchStatus}</p>
              )}
          </div>
        </div>
      </div>
    );
  }
  
}

