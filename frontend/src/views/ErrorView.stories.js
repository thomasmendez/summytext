import React from 'react';
import ErrorView from './ErrorView';

export default {
  title: 'Views/ErrorView',
  component: ErrorView,
  argTypes: {
    errorCode: { control: 'number' },
  },
};

const Template = args => <ErrorView {...args}/>;

export const ErrorViewView = Template.bind({});
ErrorViewView.args = {
  title: '404 | Sum My Text',
  errorCode: 404,
};