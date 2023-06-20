import React from 'react';
import PdfToTextButton from './PdfToTextButton';

export default {
  title: 'Components/InputSummary/InputTextbox/PdfToTextButton',
  component: PdfToTextButton,
  argTypes: {
  },
};

const Template = args => <PdfToTextButton {...args}/>;

export const PdfToTextButtonComponent = Template.bind({});
PdfToTextButtonComponent.args = {
};