import React from 'react';
import { Button } from '@mui/material';

const SubmitButton = () => {
  return(
    <Button fullWidth variant="contained" color="success" size='large'>
      Submit
    </Button>
  );
};

SubmitButton.defaultProps = {
};

SubmitButton.propTypes = {
};

export default SubmitButton;
