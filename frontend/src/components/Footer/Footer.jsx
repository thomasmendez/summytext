import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';

const Footer = (props) => {
  const { pb, pt } = props;
  return (
    <Grid container sx={{ borderTop: 'solid 1px gray' }} direction="row" textAlign="center" pb={pb} pt={pt}>
      <Grid item xs={12}>
        <Typography>
          ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          Copyright
        </Typography>
      </Grid>
    </Grid>
  );
};

Footer.defaultProps = {
  pb: 5,
  pt: 5,
};

Footer.propTypes = {
  pb: PropTypes.number,
  pt: PropTypes.number,
};

export default Footer;