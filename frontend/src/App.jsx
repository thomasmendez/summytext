import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { analysisActions } from './store/analysis';
import axios from 'axios';
import { Grid } from '@mui/material';
import TitleHeader from './components/TitleHeader';
import Main from './views/Main';
import Analysis from './views/Analysis';
import Footer from './components/Footer';

function App() {
  const dispatch = useDispatch();
  const isLoading  = useSelector((state) => state.analysis.isLoading);
  const reqBody = useSelector((state) => state.analysis.reqBody);
  const data = useSelector((state) => state.analysis.data);

  useEffect(() => {
    if (isLoading) {
      axios.put('http://localhost:8080/baseUrl/v1/predict', {
        reqBody,
      }).then(res => {
        dispatch(analysisActions.completedAnalysis(res.data));
      }).catch(err => {
        if (err.response) {
          // Request made and server responded
          console.error(err.response.data);
          console.error(err.response.status);
          console.error(err.response.headers);
          dispatch(analysisActions.errorAnalysis(err.data));
        } else if (err.request) {
          // The request was made but no response was received
          console.error(err.request);
          dispatch(analysisActions.errorAnalysis(err.request));
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error', err.message);
          dispatch(analysisActions.errorAnalysis(err.message));
        }
      });
    }
  }, [dispatch, isLoading, reqBody]);

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
        <TitleHeader titleName='Sum My Text' variant={'h4'} backgroundColor={'#b5ecf5'} />
      </Grid>
      <Grid item xs={12}>
        {data ? (
          <Analysis
            sentiment={data.sentiment}
            grammaticalCorrectness={data.grammaticalCorrectness}
            topics={data.topics}
            summary={data.summary}
          />
        ) : (<Main />)}
      </Grid>
      <Grid item xs={12}>
        <Footer />
      </Grid>
    </Grid>
  );
}

export default App;
