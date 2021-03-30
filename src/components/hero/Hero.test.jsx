import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Hero from './Hero';

describe('Hero', () => {
  it('displays hero text', () => {
    const firstWord = 'Here';
    render(<Hero text="Here be bears" highlight={firstWord} />);
    expect(screen.getByText(firstWord)).toBeInTheDocument();
    expect(screen.getByText(firstWord)).toHaveClass('highlighted');

    expect(screen.getByText('be bears')).toBeInTheDocument();
  });
});
