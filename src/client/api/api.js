const ipdataApiKey = process.env.IPDATA_API_KEY;
const weatherbitKey = process.env.WEATHERBIT_KEY;
const countryCodeEndpoint = 'https://raw.githubusercontent.com/jgudo/react-weather-app/master/static/country-code.json';
const ipdataEndpoint = `https://api.ipdata.co/?api-key=${ipdataApiKey}`;
const weatherbitForecast = 'https://api.weatherbit.io/v2.0/forecast/daily?';

// Unused vars. I've search for the perfect API and finally found WeatherBit

// const owmKey = process.env.OWM_KEY;
// const accuKey = process.env.ACCU_KEY;
// const timezoneDbApiKey = process.env.TIMEZONE_DB_API_KEY;
// const accuWeather = 'http://dataservice.accuweather.com/';
// const owmEndPoint = 'https://api.openweathermap.org/data/2.5/weather?';
// const timezoneDbEndpoint = `https://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneDbApiKey}&format=json&by=position&`;

export const fetchCountryCode = async () => {
  const requestCountryCode = await fetch(countryCodeEndpoint);
  const countryCode = await requestCountryCode.json();

  return countryCode;
};

export const fetchForecast = async (query, lat, lon) => {
  const searchQuery = query ? `city=${query}&` : '';
  const latitude = lat ? `lat=${lat}&` : '';
  const longitude = lon ? `lon=${lon}&` : '';
  const url = `${weatherbitForecast + searchQuery + latitude + longitude}days=7&key=${weatherbitKey}`;
  const forecastRequest = await fetch(url);
  const forecast = await forecastRequest.json();
  
  return forecast;
};

export const fetchCurrentLocationAndWeather = async () => {
  const requestLocation = await fetch(ipdataEndpoint);
  const location = await requestLocation.json();
  const weather = await fetchForecast(undefined, location.latitude, location.longitude)
  
  return weather;
};

// -----
// Open Weather Map. Not used. Just ignore this
// export const fetchWeather = async (lat = '', lon = '', query = '') => {
//   const searchQuery = query ? `q=${query}&` : '';
//   const latitude = lat ? `lat=${lat}&` : '';
//   const longitude = lon ? `lon=${lon}&` : '';
//   const url = `${owmEndPoint + searchQuery + latitude + longitude}APPID=${owmKey}&units=metric`
//   const weatherRequest = await fetch(url);
//   const weather = await weatherRequest.json();

//   return weather;
// };

// ---- 
// Accuweather Not used. You can ignore this
// export const fetchLocationKey = async (lat, lon) => {
//   const query = `locations/v1/cities/geoposition/search?apikey=${accuKey}&q=${lat}%2C${lon}`;
//   const locationKeyRequest = await fetch(`${accuWeather + query}`);
//   const locationKey = await locationKeyRequest.json();

//   return locationKey.Key;
// };

// -----
// Not used. Ignore this.
// export const getTimezone = async (lat, lon) => {
//   const requestTimeZone = await fetch(`${timezoneDbEndpoint}&lat=${lat}&lng=${lon}`);
//   const timezone = await requestTimeZone.json();

//   return timezone;
// };
