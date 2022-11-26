import React from 'react';
import { Grid } from '@mui/material';
import TitleHeader from '../TitleHeader';
import InputTextbox from './InputTextbox';

const InputSummary = () => {
  return(
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <TitleHeader titleName='Text to Summarize' variant={'h5'} pt={3} pb={3} backgroundColor={'#b5ecf5'} />
      </Grid>
      <Grid item xs={12}>
        <InputTextbox />
      </Grid>
    </Grid>
  );
};

InputSummary.defaultProps = {
};

InputSummary.propTypes = {
};

export default InputSummary;
