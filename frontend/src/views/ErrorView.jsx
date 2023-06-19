import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import useWindowDimensions from '../utils/windowDimensions';

import TitleHeader from '../components/TitleHeader';

const ErrorView = (props) => {
  const { errorCode, title } = props;
  useEffect(() => document.title = title, [title]);
  const { height } = useWindowDimensions();
  const errorPageHeight = height * 0.75;
  let message = '';

  if (errorCode === 404) {
    message = 'Not Found';
  }
  return (
    <Grid
      className="Error"
      container
      item
      style={{ backgroundColor: 'lavender'}}
    >
      <Grid item xs={12} sx={{height: errorPageHeight}}>
        <TitleHeader titleName={errorCode + ' ' + message} variant={'h4'} backgroundColor={'#b5ecf5'} />
      </Grid>
    </Grid>
  );
};

ErrorView.propTypes = {
  title: PropTypes.string.isRequired,
  errorCode: PropTypes.number.isRequired,
};

export default ErrorView;
