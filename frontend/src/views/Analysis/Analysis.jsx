import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import TitleHeader from '../../components/TitleHeader';
import CardResult from '../../components/CardResult';

const Analysis = () => {
    return (
      <Grid
        container
        item
        spacing={3}
      >
        <Grid item xs={12}>
          <TitleHeader titleName='Analysis' variant={'h4'} pt={3} pb={3} backgroundColor={'#b5ecf5'} />
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid container item xs={6}>
            <CardResult title='Sentiment' content='Positive' backgroundColor={'#b5ecf5'}/>
          </Grid>
          <Grid container item xs={6}>
            <CardResult title='Gramatical Correctness' content='Passing' backgroundColor={'#b5ecf5'}/>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <CardResult title='Topics' content='List of Topics' backgroundColor={'#b5ecf5'}/>
        </Grid>
        <Grid container item xs={12}>
          <CardResult title='Summarized Text' content='Summary' backgroundColor={'#b5ecf5'}/>
        </Grid>
      </Grid>
    );
};

export default Analysis;
