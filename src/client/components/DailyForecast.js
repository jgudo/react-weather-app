import React from 'react';
import moment from 'moment';

import { weatherbitIcons } from '../helpers/icons';

const DailyForecast = ({ forecast, isCelcius }) => {
  const day = {
    0: 'SUN',
    1: 'MON',
    2: 'TUE',
    3: 'WED',
    4: 'THU',
    5: 'FRI',
    6: 'SAT'
  };

  return (
    <div className="forecast">
      {forecast.map((data, index) => {
        const dayCode = moment(data.datetime).day();
        return index !== 0 && (
          <div 
              className="forecast__item"
              key={data.ts}
          >
            <i className={`wi ${weatherbitIcons[data.weather.icon]}`}></i>
            <h5 className="forecast-date">{day[dayCode]}</h5>
            <h2 className="forecast-temp">
              {isCelcius ? data.temp : Math.round((data.temp * (9 / 5)) + 32)}<span>°</span>
            </h2>
          </div>
        );
      })}
    </div>
  );
};

export default DailyForecast;
