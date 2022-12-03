import React from 'react';
import SpeechToTextButton from './SpeechToTextButton';

export default {
  title: 'Components/InputSummary/InputTextbox/SpeechToTextButton',
  component: SpeechToTextButton,
  argTypes: {
  },
};

const Template = args => <SpeechToTextButton {...args}/>;

export const SpeechToTextButtonComponent = Template.bind({});
SpeechToTextButtonComponent.args = {
};