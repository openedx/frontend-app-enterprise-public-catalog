import React from 'react';
import { screen, render } from '@testing-library/react';
import NotFoundPage, { NOT_FOUND_TEXT } from '../NotFoundPage';
import '@testing-library/jest-dom/extend-expect';

describe('NotFoundPage rendering', () => {
  test('Page renders successfully', () => {
    render(<NotFoundPage />);
    expect(screen.getByText(NOT_FOUND_TEXT)).toBeInTheDocument();
  });
});
