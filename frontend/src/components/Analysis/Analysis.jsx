import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, CardContent } from '@mui/material';
import TitleHeader from '../TitleHeader';
import CardResult from '../CardResult';

const Analysis = (props) => {
  const { backgroundColor, sentiment, topics, summary } = props;
    return (
      <Grid container item xs={12}>
        <Grid item xs={12}>
          <TitleHeader titleName='Analysis' variant={'h5'} pt={3} pb={3} backgroundColor={'#b5ecf5'} />
        </Grid>
        <Card sx={{ width: 1 }} style={{ backgroundColor: backgroundColor }}>
          <CardContent>
            <Grid container item xs={12} spacing={3}>
              <Grid container item xs={12}>
                <CardResult title='Sentiment' content={sentiment} backgroundColor={'#b5ecf5'}/>
              </Grid>
              <Grid container item xs={12}>
                <CardResult title='Topics' content={topics} backgroundColor={'#b5ecf5'}/>
              </Grid>
              <Grid container item xs={12}>
                <CardResult title='Summarized Text' content={summary} backgroundColor={'#b5ecf5'}/>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
};

Analysis.defaultProps = {
  backgroundColor: '#d3eef2',
  sentiment: 'Positive',
  grammaticalCorrectness: 'Passing',
  topics: ['Technology', 'History', 'Medicine'],
  summary: 'My text summary',
};

Analysis.propTypes = {
  backgroundColor: PropTypes.string,
  sentiment: PropTypes.string,
  grammaticalCorrectness: PropTypes.string,
  topics: PropTypes.arrayOf(PropTypes.string),
  summary: PropTypes.string,
};

export default Analysis;
