import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const TitleHeader = (props) => {
  const { backgroundColor, colorSubText, titleName, pb, pt, variant } = props;
  return(
    <Typography textAlign="center" variant={variant} pb={pb} pt={pt} sx={{ color: colorSubText, backgroundColor: backgroundColor}}>
      {titleName}
    </Typography>
  );
};

TitleHeader.defaultProps = {
  backgroundColor: 'lavender',
  colorSubText: 'black',
  pb: 5,
  pt: 5,
  variant: 'h3',
};

TitleHeader.propTypes = {
  backgroundColor: PropTypes.string,
  colorSubText: PropTypes.string,
  pb: PropTypes.number,
  pt: PropTypes.number,
  titleName: PropTypes.string.isRequired,
  variant: PropTypes.string,
};

export default TitleHeader;