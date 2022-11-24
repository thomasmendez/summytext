import React from 'react';
import { Provider } from 'react-redux'
import store from "../src/store";
import shadePalette from './shadePalette.json'
import primaryColorsPalette from './primaryColorsPalette.json'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  colorPalettes: {
    default: 'Primary Colors', // Name of default palette for all components and its stories. Optional (fallback to first palette from the palettes array).
    palettes: [
      {
        name: 'Primary Colors',
        palette: primaryColorsPalette,
      },
      {
        name: 'Light & Dark', // string
        palette: shadePalette, // Palette as an Object or an Array. See bellow.
      },
    ]
  }
}

export const decorators = [
  (Story) => (
    <Provider store={store}>
      <Story />
    </Provider>
  )
]
