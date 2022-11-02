import React from 'react';
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Highlighted } from '.';

describe('Highlighted', () => {
  it('renders the text alone if there is no highlight', () => {
    const text = 'Bears r gr8';
    render(<Highlighted text={text} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });
  it('highlights text', () => {
    const text = 'Bears r gr8';
    const highlight = 'rs r gr';
    render(<Highlighted text={text} highlight={highlight} />);
    const highlightedText = screen.getByText(highlight);
    expect(highlightedText).toHaveClass('highlighted');
  });
  it('adds a custom class name as needed', () => {
    const text = 'Bears r gr8';
    const highlight = 'rs r gr';
    const highlightClass = 'awesome';
    render(
      <Highlighted
        text={text}
        highlight={highlight}
        highlightClass={highlightClass}
      />,
    );
    const highlightedText = screen.getByText(highlight);
    expect(highlightedText).toHaveClass(highlightClass);
    expect(highlightedText).toHaveClass('highlighted');
  });
});
