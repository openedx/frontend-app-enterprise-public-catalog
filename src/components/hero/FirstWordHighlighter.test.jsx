import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FirstWordHighlighter } from './Hero';

describe('FirstWordHighlighter', () => {
  it('highlights the first word', () => {
    const firstWord = 'Bears';
    const otherWords = 'are gr8';
    render(<FirstWordHighlighter text={`${firstWord} ${otherWords}`} />);
    const firstResult = screen.getByText(firstWord);
    expect(firstResult).toHaveAttribute('class', 'highlighted');
  });
  it('displays the other text', () => {
    const firstWord = 'Bears';
    const otherWords = 'are gr8';
    render(<FirstWordHighlighter text={`${firstWord} ${otherWords}`} />);
    const otherWordsResult = screen.getByText(otherWords);
    expect(otherWordsResult).not.toHaveAttribute('class', 'highlighted');
  });
});
