import React from 'react';
import CardResult from './CardResult';

export default {
  title: 'Components/CardResult',
  component: CardResult,
  argTypes: {
    backgroundColor: { control: 'color' },
    title: { control: 'text' },
    content: { control: 'text' },
  },
};

const Template = args => <CardResult {...args}/>;

export const CardResultComponent = Template.bind({});
CardResultComponent.args = {
  backgroundColor: '#b5ecf5',
  title: 'Title',
  content: 'Content',
};