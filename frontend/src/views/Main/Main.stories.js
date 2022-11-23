import React from 'react';
import Main from './Main';

export default {
  title: 'Views/Main',
  component: Main,
  argTypes: {
  },
};

const Template = args => <Main {...args}/>;

export const MainView = Template.bind({});
MainView.args = {
};