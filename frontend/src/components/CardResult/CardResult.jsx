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
            {Array.isArray(content) ? content.join(', ') : content}
          </Typography>
        </CardContent>
      </Card>
    );
};

CardResult.defaultProps = {
  backgroundColor: 'lavender',
  title: 'Title',
  content: ['Technology', 'History', 'Medicine'],
};

CardResult.propTypes = {
  backgroundColor: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.objectOf(PropTypes.string),
  ]),
};

export default CardResult;
