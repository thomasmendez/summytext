import React from 'react';
import InputTextbox from './InputTextbox';

export default {
  title: 'Components/InputTextbox',
  component: InputTextbox,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = args => <InputTextbox {...args}/>;

export const InputTextboxComponent = Template.bind({});
InputTextboxComponent.args = {
  backgroundColor: '#f5f8fa',
};