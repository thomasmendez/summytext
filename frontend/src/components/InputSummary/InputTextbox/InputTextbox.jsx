import React from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { analysisActions } from '../../../store/analysis';
// import 'regenerator-runtime/runtime';
// import { useSpeechRecognition } from 'react-speech-recognition';
import PropTypes from 'prop-types';
import { Card, CardContent, CardActions, TextField } from '@mui/material';
// import SpeechToTextButton from './SpeechToTextButton';
import PdfToTextButton from './PdfToTextButton';
import SubmitButton from './SubmitButton';

const InputTextbox = (props) => {
  const { backgroundColor } = props;
  const dispatch = useDispatch();
  const text = useSelector((state) => state.analysis.text);
  const previousText = useSelector((state) => state.analysis.previousText);
  // const { browserSupportsSpeechRecognition } = useSpeechRecognition();
  // if (!browserSupportsSpeechRecognition) {
  //   console.warn('Browser does not support speech recognition');
  // }
  return(
    <Card sx={{ width: 1 }} style={{ backgroundColor: backgroundColor }}>
      <CardContent>
        <TextField
          fullWidth
          label="Enter text you wish to summarize here..."
          multiline
          rows={20}
          value={text || previousText || ''}
          inputRef={input => input && input.focus()}
          InputLabelProps={{ shrink: true }}
          inputProps={{ maxLength: 5000 }}
          onChange={(e) => dispatch(analysisActions.handleTextFieldChange(e.target.value))}
        />
      </CardContent>
      <CardActions>
        {/* {browserSupportsSpeechRecognition && (<SpeechToTextButton/>)} */}
        <PdfToTextButton/>
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
