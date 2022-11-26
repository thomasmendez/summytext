import React from 'react';
import InputSummary from './InputSummary';

export default {
  title: 'Components/InputSummary',
  component: InputSummary,
  argTypes: {
  },
};

const Template = args => <InputSummary {...args}/>;

export const InputSummaryComponent = Template.bind({});
InputSummaryComponent.args = {
};