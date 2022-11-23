import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from '@mui/material';

const SubmitButton = ({ initialIsLoading }) => {
  const [isLoading, setIsLoading] = useState(initialIsLoading);

  useEffect(() => {
    setIsLoading(initialIsLoading);
  }, [initialIsLoading]);

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
        <Button fullWidth variant="contained" color="success" size='large' onClick={() => {setIsLoading(true);}}>
          Submit
        </Button>
      )}
    </>
  );
};

SubmitButton.defaultProps = {
  initialIsLoading: false,
};

SubmitButton.propTypes = {
  initialIsLoading: PropTypes.bool.isRequired,
};

export default SubmitButton;
