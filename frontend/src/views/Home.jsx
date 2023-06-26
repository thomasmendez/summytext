import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { analysisActions } from '../store/analysis';
import { performAnalysis } from '../services/sumMyTextService';
import { Grid, Snackbar, Alert } from '@mui/material';
import TitleHeader from '../components/TitleHeader';
import InputSummary from '../components/InputSummary';
import Analysis from '../components/Analysis';

function Home(props) {
  useEffect(() => document.title = props.title, [props.title]);

  const dispatch = useDispatch();
  const isLoading  = useSelector((state) => state.analysis.isLoading);
  const text = useSelector((state) => state.analysis.text);
  const data = useSelector((state) => state.analysis.data);
  const error = useSelector((state) => state.analysis.error);
  const info = useSelector((state) => state.analysis.info);

  const [keepSnackbarOpen, setKeepSnackbarOpen] = useState(true);

  let takingTooLongTimer; 

  useEffect(() => {
    if (isLoading && keepSnackbarOpen) {
      takingTooLongTimer = setInterval(() => {
        dispatch(analysisActions.infoAnalysis('The request is taking longer than expected. Please wait'));
      }, 7000);
    }
  }, [isLoading, keepSnackbarOpen]);

  useEffect(() => {
    if (isLoading) {
      performAnalysis(text).then(res => {
        clearInterval(takingTooLongTimer);
        dispatch(analysisActions.clearInfoAnalysis());
        dispatch(analysisActions.completedAnalysis(res.data));
      }).catch(err => {
        clearInterval(takingTooLongTimer);
        dispatch(analysisActions.clearInfoAnalysis());
        if (err.response) {
          // Request made and server responded
          console.error(err.response.data);
          console.error(err.response.status);
          console.error(err.response.headers);
          dispatch(analysisActions.errorAnalysis(`${err.response.status} Error`));
        } else if (err.request) {
          // The request was made but no response was received
          console.error(err.request);
          dispatch(analysisActions.errorAnalysis('Sorry, we couldn\'t connect to the server. Please try again later.'));
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error', err.message);
          dispatch(analysisActions.errorAnalysis(`${err.response.status} Error`));
        }
      });
    }
  }, [isLoading]);

  return (
    <Grid
      className="Home"
      container
      item
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      spacing={3}
      style={{ backgroundColor: 'lavender'}}
    >
      <Snackbar
        open={(error || info) ? true : false}
        autoHideDuration={info ? null : 6000}
        onClose={() => {
          clearInterval(takingTooLongTimer);
          dispatch(analysisActions.clearErrorAnalysis());
          dispatch(analysisActions.clearInfoAnalysis());
          setKeepSnackbarOpen(false);
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert variant="filled" severity={error ? 'error' : 'info'} sx={{ width: '100%' }} onClose={() => {
          clearInterval(takingTooLongTimer);
          dispatch(analysisActions.clearErrorAnalysis());
          dispatch(analysisActions.clearInfoAnalysis());
          setKeepSnackbarOpen(false);
        }}
        >
          {error || info}
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
    </Grid>
  );
}

Home.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Home;
