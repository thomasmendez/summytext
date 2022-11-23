import React from 'react';
import { Grid } from '@mui/material';
import TitleHeader from './components/TitleHeader';
import Main from './views/Main';
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
        <Main />
      </Grid>
      <Grid item xs={12}>
        <Footer />
      </Grid>
    </Grid>
  );
}

export default App;
