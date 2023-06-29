import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Link, Typography } from '@mui/material';
import TitleHeader from '../components/TitleHeader';

function About(props) {
  useEffect(() => document.title = props.title, [props.title]);
  
  return (
    <Grid
      className="About"
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
        <TitleHeader titleName='About' variant={'h5'} backgroundColor={'#b5ecf5'} />
      </Grid>
      <Grid item xs={12}>
        <Typography textAlign="center" variant={'h6'} pb={5} pt={5} sx={{ color: 'black', backgroundColor: '#b5ecf5', fontWeight: 'normal'}}>
          Sum My Text is a free online tool that allows users to summarize their text, extract topics presented in the text, and provide its overall sentiment.
          <br /> 
          {' '}
          There is currently a character limit of 5000 characters or approximately one page of text to prevent responses from potentially being super slow. 
          <br /> 
          {' '}
          The text can be typed, copy pasted, or imported from a pdf file.
          <br />
          {' '}
          <br />

          {' '}
          Summarizing text for the first time when you visit may take a couple of seconds because the AI models are being loaded.
          <br /> 
          {' '}
          Please do not abuse the usage of the tool. There is a set limit of times a user can summarize over a given period of time.
          <br />
          {' '}
          If you made too many summaries in a given set of time, you will get an error. Please try to use the tool at a later point in time.
          <br /> 
          {' '}
          <br />

          The tool is built using the 
          {' '}
          <Link href="https://pypi.org/project/bert-extractive-summarizer">
            ChatGPT 2 Transformer Model
          </Link>
          {' '}
          and 
          {' '}
          <Link href="https://github.com/flairNLP/flair">
            Flair NLP Sentiment and Classification models
          </Link>
          .
          <br /> 
          {' '}
          <br />

          The only supported language text is English as of right now.
          <br /> 
          {' '}
          <br />

          The tool does not store any text data that is provided for summarizing.
          <br />
          Please look at the privacy section to learn more. 
        </Typography>
      </Grid>
    </Grid>
  );
}

About.propTypes = {
  title: PropTypes.string.isRequired,
};

export default About;
