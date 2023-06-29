import React from 'react';
import About from './About';

export default {
  title: 'Views/About',
  component: About,
  argTypes: {
    errorCode: { control: 'number' },
  },
};

const Template = args => <About {...args}/>;

export const AboutView = Template.bind({});
AboutView.args = {
  title: 'About | Sum My Text',
};