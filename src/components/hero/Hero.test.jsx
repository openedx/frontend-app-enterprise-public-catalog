import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Hero from './Hero';

describe('Hero', () => {
  it('displays hero text', () => {
    render(<Hero text="Here be bears" />);
    expect(screen.getByText('Here')).toBeInTheDocument();
    expect(screen.getByText('be bears')).toBeInTheDocument();
  });
});
