import React from 'react';
import { Grid } from '@mui/material';
import TitleHeader from './components/TitleHeader';
import InputTextbox from './components/InputTextbox';
import SubmitButton from './components/SubmitButton';
import Footer from './components/Footer';

function App() {
  return (
    <Grid
      className="App"
      container
      item
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      spacing={3}
      style={{ backgroundColor: 'lavender'}}
    >
      <Grid item xs={12}>
        <TitleHeader titleName='Sum My Text' backgroundColor={'#b5ecf5'} />
      </Grid>
      <Grid item xs={12}>
        <TitleHeader titleName='Text to Summarize' variant={'h4'} pt={3} pb={3} backgroundColor={'#b5ecf5'} />
      </Grid>
      <Grid item xs={12}>
        <InputTextbox />
      </Grid>
      <Grid item xs={12}>
        <SubmitButton />
      </Grid>
      <Grid item xs={12}>
        <Footer />
      </Grid>
    </Grid>
  );
}

export default App;
