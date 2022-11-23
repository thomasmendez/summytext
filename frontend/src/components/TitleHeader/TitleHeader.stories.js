import React from 'react';
import TitleHeader from './TitleHeader';

export default {
  title: 'Components/TitleHeader',
  component: TitleHeader,
  argTypes: {
    backgroundColor: { control: 'color' },
    colorSubText: { control: 'color' },
    pb: { control: 'number'},
    pt: { control: 'number'},
    variant: { control: 'text'},
  },
};

const Template = args => <TitleHeader {...args}/>;

export const TitleHeaderComponent = Template.bind({});
TitleHeaderComponent.args = {
  backgroundColor: '#f5f8fa',
  colorSubText: 'black',
  titleName: 'Sum My Text',
  pb: 5,
  pt: 5,
  variant: 'h3',
};