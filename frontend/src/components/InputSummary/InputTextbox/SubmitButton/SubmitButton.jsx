import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from '@mui/material';
import { analysisActions } from '../../../../store/analysis';

const SubmitButton = () => {

  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.analysis.isLoading);

  return(
    <>
      {isLoading ? (
        <LoadingButton
          loading
          fullWidth
          variant="outlined"
        >
          Submit
        </LoadingButton>
      ) : (
        <Button fullWidth variant="contained" color="success" size='large' onClick={() => {dispatch(analysisActions.performAnalysis({text: 'my text'}));}}>
          Submit
        </Button>
      )}
    </>
  );
};

SubmitButton.defaultProps = {
};

SubmitButton.propTypes = {
};

export default SubmitButton;
