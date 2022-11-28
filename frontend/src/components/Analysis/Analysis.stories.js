import React from 'react';
import Analysis from './Analysis';

export default {
  title: 'Views/Analysis',
  component: Analysis,
  argTypes: {
    sentiment: { control: 'text' },
    grammaticalCorrectness: { control: 'text' },
    topics: { control: 'object'},
    summary: { control: 'text' },
  },
};

const Template = args => <Analysis {...args}/>;

export const AnalysisView = Template.bind({});
AnalysisView.args = {
  sentiment: 'Positive',
  grammaticalCorrectness: 'Passing',
  topics: ['Technology', 'History', 'Medicine'],
  summary: 'My text summary',
};