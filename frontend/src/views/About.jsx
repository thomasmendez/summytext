import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { BREAKPOINTSM } from '../utils/breakpoints';
import useWindowDimensions from '../utils/windowDimensions';
import { Grid, Link, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box } from '@mui/material';
import TitleHeader from '../components/TitleHeader';

function About(props) {
  const { width } = useWindowDimensions();
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
        <Grid container item xs={12} sx={{ color: 'black', backgroundColor: '#b5ecf5', fontWeight: 'normal'}}>
          <Grid item xs={12} pt={5} pb={5} spacing={1}>
            <Typography textAlign="center" variant={'h6'}>
              Need to summarize a text message, report, review, or an email? No problem!
            </Typography>
            <Typography textAlign="center" variant={'h6'}>
              Sum My Text is a free online tool that allows users to summarize, identify topics, and describe emotional sentiment of their text.
            </Typography>
          </Grid>
          {width > BREAKPOINTSM && <Grid item xs={4} />}
          <Grid item xs={width > BREAKPOINTSM ? 4 : 12} pb={5}>
            <Table sx={{ border: '1px solid black' }}>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ borderBottom: '1px solid black' }}>
                    📕 Summarizes
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid black' }}>
                    Reports, essays & documents
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: '1px solid black' }}>
                    🚀Capabilities
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid black' }}>
                    <p>
                      Summarize Up To 5000 Characters (approx. 1 page 12-pt font)
                    </p>
                    <p>
                      Identify Topics (Classification)
                    </p>
                    <p>
                      Emotional Tone (Positive or Negative)
                    </p>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: '1px solid black' }}>
                    💡 AI Models
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid black' }}>
                    <p>
                      ChatGPT 2 Transformer Model
                    </p>
                    <p>
                      Flair NLP Classification Model
                    </p>
                    <p>
                      Flair NLP Sentiment Model
                    </p>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: '1px solid black' }}>
                    💰 Free to Use
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid black' }}>
                    <Typography>
                      Summarize at no cost
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

About.propTypes = {
  title: PropTypes.string.isRequired,
};

export default About;
