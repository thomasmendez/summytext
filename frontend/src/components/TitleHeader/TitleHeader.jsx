import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';

const TitleHeader = (props) => {
  const { backgroundColor, colorSubText, titleName } = props;
  return(
    <Grid
      container
      item
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      spacing={3}
      pb={5}
      sx={{ backgroundColor: backgroundColor }}
    >
      <Grid item xs={12}>
        <Grid item>
          <Typography variant="h3" pt={5} pb={5}
            sx={{ color: colorSubText }}
          >
            {titleName}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

TitleHeader.defaultProps = {
  backgroundColor: '#f5f8fa',
  colorSubText: 'black',
};

TitleHeader.propTypes = {
  backgroundColor: PropTypes.string,
  colorSubText: PropTypes.string,
  titleName: PropTypes.string.isRequired,
};

export default TitleHeader;