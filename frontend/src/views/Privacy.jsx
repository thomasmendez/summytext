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
        <Grid container item xs={12} sx={{ color: 'black', backgroundColor: '#b5ecf5', fontWeight: 'normal'}}>
          <Grid item xs={12} pt={5} pb={5} spacing={1}>
            <Typography textAlign="center" variant={'h6'}>
              Sum My Text does not store any personal data that is inputed for summarizing.
            </Typography>
            <Typography textAlign="center" variant={'h6'}>
              No data that is typed or imported from a PDF is stored.
            </Typography>
          </Grid>
          <Grid item xs={12} pb={5} spacing={1}>
            <Typography textAlign="center" variant={'h6'}>
              Tracking services are used only to measure usage and to detect page and server errors. 
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

PrivacyView.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PrivacyView;
