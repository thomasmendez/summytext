import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import TitleHeader from '../components/TitleHeader';

function PrivacyView(props) {
  useEffect(() => document.title = props.title, [props.title]);

  return (
    <Grid
      className="Privacy"
      container
      item
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      spacing={3}
      style={{ backgroundColor: 'lavender'}}
    >
      <Grid item xs={12}>
        <TitleHeader titleName='Sum My Text' variant={'h4'} backgroundColor={'#b5ecf5'} />
      </Grid>
      <Grid item xs={12}>
        <TitleHeader titleName='Privacy' variant={'h5'} backgroundColor={'#b5ecf5'} />
      </Grid>
      <Grid item xs={12}>
        <Typography textAlign="center" variant={'h6'} pb={5} pt={5} sx={{ color: 'black', backgroundColor: '#b5ecf5', fontWeight: 'normal'}}>
          Sum My Text does not store any personal data that is inputed for summarizing.
          <br /> 
          {' '}
          No data that is typed or imported from a PDF is stored.
          <br /> 
          {' '}
          <br />
          What data does the tool store?
          <br />
          The page uses Google analytics to track page visits. 
          {' '}
          <br />
          IP Addresses are templorarily stored for preventing abuse of the tool.
          {' '}
          <br />
          AWS CloudWatch logs are used for metrics and detecting server errors. 
          {' '}
        </Typography>
      </Grid>
    </Grid>
  );
}

PrivacyView.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PrivacyView;
