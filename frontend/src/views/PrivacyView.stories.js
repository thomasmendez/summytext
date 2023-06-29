import React from 'react';
import Privacy from './Privacy';

export default {
  title: 'Views/Privacy',
  component: Privacy,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = args => <Privacy {...args}/>;

export const PrivacyView = Template.bind({});

PrivacyView.args = {
  title: 'Privacy | Thomas A. Mendez',
};