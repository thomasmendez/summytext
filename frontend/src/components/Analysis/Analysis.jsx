import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import TitleHeader from '../TitleHeader';
import CardResult from '../CardResult';

const Analysis = (props) => {
  const { sentiment, grammaticalCorrectness, topics, summary } = props;
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
            <CardResult title='Sentiment' content={sentiment} backgroundColor={'#b5ecf5'}/>
          </Grid>
          <Grid container item xs={6}>
            <CardResult title='Gramatical Correctness' content={grammaticalCorrectness} backgroundColor={'#b5ecf5'}/>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <CardResult title='Topics' content={topics} backgroundColor={'#b5ecf5'}/>
        </Grid>
        <Grid container item xs={12}>
          <CardResult title='Summarized Text' content={summary} backgroundColor={'#b5ecf5'}/>
        </Grid>
      </Grid>
    );
};

Analysis.defaultProps = {
  sentiment: 'Positive',
  grammaticalCorrectness: 'Passing',
  topics: ['math', 'science'],
  summary: 'My text summary',
};

Analysis.propTypes = {
  sentiment: PropTypes.string,
  grammaticalCorrectness: PropTypes.string,
  topics: PropTypes.arrayOf(PropTypes.string),
  summary: PropTypes.string,
};

export default Analysis;
