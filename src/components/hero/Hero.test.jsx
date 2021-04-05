import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Hero from './Hero';
import { renderWithRouter } from '../tests/testUtils';

describe('Hero', () => {
  it('displays hero text', () => {
    const firstWord = 'Here';
    renderWithRouter(<Hero text="Here be bears" highlight={firstWord} />);
    expect(screen.getByText(firstWord)).toBeInTheDocument();
    expect(screen.getByText(firstWord)).toHaveClass('highlighted');

    expect(screen.getByText('be bears')).toBeInTheDocument();
  });
});
