import React from 'react';
import { render, screen } from '@testing-library/react';
import Welcome from './Welcome';

describe('test suite for Welcome component', () => {
  test("it should contain the text 'Welcome to my website!'", () => {
    // Arrange
    const text = 'Welcome to my website!';
    // Act
    render(<Welcome />);
    // Assert
    expect(screen.getByText(text)).toBeTruthy();
  });
});
