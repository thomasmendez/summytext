import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';

const CardResult = (props) => {
  const { backgroundColor, title, content } = props;
    return (
      <Card sx={{ width: 1 }} style={{ backgroundColor: backgroundColor }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" component="div">
            {content}
          </Typography>
        </CardContent>
      </Card>
    );
};

CardResult.defaultProps = {
  backgroundColor: 'lavender',
  title: 'Title',
  content: 'Content',
};

CardResult.propTypes = {
  backgroundColor: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
};

export default CardResult;
