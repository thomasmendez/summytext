import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField } from '@mui/material';

const InputTextbox = (props) => {
  const { backgroundColor } = props;
  return(
    <Grid
      container
      alignItems="left"
      justifyContent="left"
      textAlign="left"
    >
      <TextField
        fullWidth
        label="Enter text you wish to summarize here..."
        multiline
        rows={20}
        style={{ backgroundColor: backgroundColor }}
      />
    </Grid>
  );
};

InputTextbox.defaultProps = {
  backgroundColor: '#d3eef2',
};

InputTextbox.propTypes = {
  backgroundColor: PropTypes.string,
};

export default InputTextbox;
