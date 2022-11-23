import React from 'react';
import { Grid } from '@mui/material';
import TitleHeader from '../../components/TitleHeader';
import InputTextbox from '../../components/InputTextbox';

const Main = () => {
    return (
      <Grid
        container
        item
        spacing={3}
      >
        <Grid item xs={12}>
          <TitleHeader titleName='Text to Summarize' variant={'h4'} pt={3} pb={3} backgroundColor={'#b5ecf5'} />
        </Grid>
        <Grid item xs={12}>
          <InputTextbox />
        </Grid>
      </Grid>
    );
};

export default Main;
