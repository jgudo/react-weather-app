import React, { Fragment } from 'react';
import { wiIcons } from '../helpers/icons';

const WeatherIcon = ({ iconCode }) => {
  return (
    <Fragment>
      <i className={`wi ${wiIcons[iconCode]}`} />
    </Fragment>
  );
};

export default WeatherIcon;
