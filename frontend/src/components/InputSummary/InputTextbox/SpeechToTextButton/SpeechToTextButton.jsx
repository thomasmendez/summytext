import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from '@mui/material';
import { analysisActions } from '../../../../store/analysis';

const SpeechToTextButton = () => {

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(analysisActions.handleTextFieldChange(transcript));
  }, [transcript]);

  return(
    <>
      {listening ? (
        <Button fullWidth variant="contained" color="warning" size='large' onClick={() => {SpeechRecognition.stopListening;}}>
          Turn off Speech to Text
        </Button>
      ) : (
        !browserSupportsSpeechRecognition ? (
          <Button fullWidth variant="outlined" size='large'>
            Browser does not support speech recognition
          </Button>
        ) : (
          <Button fullWidth variant="contained" color="success" size='large' onClick={() => {SpeechRecognition.startListening();}}>
            Speech to Text
          </Button>
        ) 
      )}
    </>
  );
};

SpeechToTextButton.defaultProps = {
};

SpeechToTextButton.propTypes = {
};

export default SpeechToTextButton;
