import React from 'react';
import {
  BrowserRouter as Router,
  useRoutes,
} from 'react-router-dom';
import WithTitle from './hoc/withTitle';
import TrackRoute from './analytics/TrackRoute';
import Home from './views/Home';
import AboutView from './views/About';
import PrivacyView from './views/Privacy';
import ErrorView from './views/ErrorView';
import Footer from './components/Footer';

const AboutWithTitle = WithTitle(AboutView);
const PrivacyWIthTitle = WithTitle(PrivacyView);
const ErrorViewWithTitle = WithTitle(ErrorView);

const AppRoutes = () => {
  const HOMEPAGE = 'Sum My Text';
  const routes = useRoutes([
    { path: '/', exact: true, element: <Home title={HOMEPAGE}/> },
    { path: '/about', exact: true, element: <AboutWithTitle title={'About'}/>},
    { path: '/privacy', exact: true, element: <PrivacyWIthTitle title={'Privacy'}/>},
    { path: '*', element: <ErrorViewWithTitle errorCode={404} title={'404'}/> },
  ]);
  return routes;
};

const App = () => {
  return (
    <Router>
      <TrackRoute>
        <AppRoutes />
        <Footer/>
      </TrackRoute>
    </Router>
  );
};

export default App;
