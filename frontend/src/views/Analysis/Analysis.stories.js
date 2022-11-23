import React from 'react';
import Analysis from './Analysis';

export default {
  title: 'Views/Analysis',
  component: Analysis,
  argTypes: {
  },
};

const Template = args => <Analysis {...args}/>;

export const AnalysisView = Template.bind({});
AnalysisView.args = {
};