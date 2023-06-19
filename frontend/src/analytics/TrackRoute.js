import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

async function trackPage(location) {
  ReactGA.send({ hitType: 'pageview', page: location.pathname });
}

const TrackRoute = ({children}) => {
  const location = useLocation();

  useEffect(() => {
    trackPage(location);
  }, [location]);

  return(
    <div>
      {children}
    </div>
  );
};

TrackRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TrackRoute;
