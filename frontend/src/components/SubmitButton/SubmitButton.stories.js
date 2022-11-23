import React from 'react';
import SubmitButton from './SubmitButton';

export default {
  title: 'Components/SubmitButton',
  component: SubmitButton,
  argTypes: {
  },
};

const Template = args => <SubmitButton {...args}/>;

export const SubmitButtonComponent = Template.bind({});
SubmitButtonComponent.args = {
};