import React from 'react';
import Footer from './Footer';

export default {
  title: 'Components/Footer',
  component: Footer,
  argTypes: {
    pb: { control: 'number'},
    pt: { control: 'number'},
  },
};

const Template = args => <Footer {...args}/>;

export const FooterComponent = Template.bind({});
FooterComponent.args = {
  pb: 5,
  pt: 5,
};