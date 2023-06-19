import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';

const Footer = (props) => {
  const { pb, pt } = props;
  return (
    <Grid
      className="Home"
      container
      item
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      spacing={3}
      style={{ backgroundColor: 'lavender'}}
      sx={{ borderTop: 'solid 1px gray' }} direction="row" pb={pb} pt={pt}
    >
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