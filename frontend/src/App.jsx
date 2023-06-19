import React from 'react';
import {
  BrowserRouter as Router,
  useRoutes,
} from 'react-router-dom';
import WithTitle from './hoc/withTitle';
import TrackRoute from './analytics/TrackRoute';
import Home from './views/Home';
import ErrorView from './views/ErrorView';
import Footer from './components/Footer';

const ErrorViewWithTitle = WithTitle(ErrorView);

const AppRoutes = () => {
  const HOMEPAGE = 'Sum My Text';
  const routes = useRoutes([
    { path: '/', exact: true, element: <Home title={HOMEPAGE}/> },
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
