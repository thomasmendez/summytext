import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { analysisActions } from './store/analysis';
import { performAnalysis } from './services/sumMyTextService';
import { Grid, Snackbar, Alert } from '@mui/material';
import TitleHeader from './components/TitleHeader';
import InputSummary from './components/InputSummary';
import Analysis from './components/Analysis';
import Footer from './components/Footer';

function App() {
  const dispatch = useDispatch();
  const isLoading  = useSelector((state) => state.analysis.isLoading);
  const text = useSelector((state) => state.analysis.text);
  const data = useSelector((state) => state.analysis.data);
  const error = useSelector((state) => state.analysis.error);

  useEffect(() => {
    if (isLoading) {
      performAnalysis({
        text: text,
      }).then(res => {
        dispatch(analysisActions.completedAnalysis(res.data));
      }).catch(err => {
        if (err.response) {
          // Request made and server responded
          console.error(err.response.data);
          console.error(err.response.status);
          console.error(err.response.headers);
          dispatch(analysisActions.errorAnalysis(err.response.data));
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
  }, [dispatch, isLoading, text]);

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
      <Snackbar
        open={error ? true : false}
        autoHideDuration={6000}
        onClose={() => dispatch(analysisActions.clearErrorAnalysis())}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert variant="filled" severity="error" sx={{ width: '100%' }} onClose={() => dispatch(analysisActions.clearErrorAnalysis())}>
          {error}
        </Alert>
      </Snackbar>
      <Grid item xs={12}>
        <TitleHeader titleName='Sum My Text' variant={'h4'} backgroundColor={'#b5ecf5'} />
      </Grid>
      <Grid container item xs={12}>
        {data ? (
          <>
            <Grid item xs={6}>
              <InputSummary />
            </Grid>
            <Grid item xs={6}>
              <Analysis
                sentiment={data.sentiment}
                grammaticalCorrectness={data.grammaticalCorrectness}
                topics={data.topics}
                summary={data.summary}
              />
            </Grid>
          </>
        ) : (
          <InputSummary />
        )}
      </Grid>
      <Grid item xs={12}>
        <Footer />
      </Grid>
    </Grid>
  );
}

export default App;
