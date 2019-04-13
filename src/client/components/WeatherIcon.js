import React, { Fragment } from 'react';

const WeatherIcon = ({ iconCode }) => {
  const wiIcons = {
    '01d': 'wi-day-sunny',
    '01n': 'wi-night-clear',
    '02d': 'wi-day-sunny-overcast',
    '02n': 'wi-night-alt-partly-cloudy',
    '03d': 'wi-day-cloudy',
    '03n': 'wi-night-alt-cloudy',
    '04d': 'wi-day-cloudy-high',
    '04n': 'wi-night-alt-cloudy-high',
    '09d': 'wi-day-sprinkle',
    '09n': 'wi-night-alt-sprinkle',
    '10d': 'wi-day-rain',
    '10n': 'wi-night-alt-rain',
    '11d': 'wi-day-thunderstorm',
    '11n': 'wi-night-alt-thunderstorm',
    '13d': 'wi-day-snow',
    '13n': 'wi-night-alt-snow',
    '50d': 'wi-day-fog',
    '50n': 'wi-night-fog'
  };

  return (
    <Fragment>
      <i className={`wi ${wiIcons[iconCode]}`} />
    </Fragment>
  );
};

export default WeatherIcon;
