import React from 'react';
import CardResult from './CardResult';

export default {
  title: 'Components/CardResult',
  component: CardResult,
  argTypes: {
    backgroundColor: { control: 'color' },
    title: { control: 'text' },
    content: { control: 'object' },
  },
};

const Template = args => <CardResult {...args}/>;

export const CardResultComponent = Template.bind({});
CardResultComponent.args = {
  backgroundColor: '#b5ecf5',
  title: 'Title',
  content: ['Technology', 'History', 'Medicine'],
};