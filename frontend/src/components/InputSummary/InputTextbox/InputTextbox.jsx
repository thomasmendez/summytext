import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardActions, TextField } from '@mui/material';
import SubmitButton from './SubmitButton';

const InputTextbox = (props) => {
  const { backgroundColor } = props;
  return(
    <Card sx={{ width: 1 }} style={{ backgroundColor: backgroundColor }}>
      <CardContent>
        <TextField
          fullWidth
          label="Enter text you wish to summarize here..."
          multiline
          rows={20}
        />
      </CardContent>
      <CardActions>
        <SubmitButton initialIsLoading={false}/>
      </CardActions>
    </Card>
  );
};

InputTextbox.defaultProps = {
  backgroundColor: '#d3eef2',
};

InputTextbox.propTypes = {
  backgroundColor: PropTypes.string,
};

export default InputTextbox;
