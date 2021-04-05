import React from 'react';
import { screen } from '@testing-library/react';
import NotFoundPage, { NOT_FOUND_TEXT } from '../NotFoundPage';
import '@testing-library/jest-dom/extend-expect';
import { renderWithRouter } from './testUtils';

describe('NotFoundPage rendering', () => {
  test('Page renders successfully', () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByText(NOT_FOUND_TEXT)).toBeInTheDocument();
  });
});
