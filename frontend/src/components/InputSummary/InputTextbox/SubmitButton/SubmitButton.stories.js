import React from 'react';
import SubmitButton from './SubmitButton';

export default {
  title: 'Components/InputTextbox/SubmitButton',
  component: SubmitButton,
  argTypes: {
    initialIsLoading: { active: { control: 'boolean' }}
  },
};

const Template = args => <SubmitButton {...args}/>;

export const SubmitButtonComponent = Template.bind({});
SubmitButtonComponent.args = {
  initialIsLoading: false
};