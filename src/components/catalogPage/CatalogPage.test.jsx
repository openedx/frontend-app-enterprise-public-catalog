import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { renderWithRouter } from '../tests/testUtils';
import CatalogPage, { heroText, ctaTitle } from './CatalogPage';

// all we are testing is routes, we don't need InstantSearch to work here
jest.mock('react-instantsearch-dom', () => ({
  ...jest.requireActual('react-instantsearch-dom'),
  InstantSearch: () => (<div>SEARCH</div>),
}));

describe('CatalogPage', () => {
  it('renders a hero component', () => {
    renderWithRouter(<CatalogPage />);
    expect(screen.getByText(heroText)).toBeInTheDocument();
  });
  it('renders a CTA component', () => {
    renderWithRouter(<CatalogPage />);
    expect(screen.getByText(ctaTitle)).toBeInTheDocument();
  });
  it('renders the catalog search component', () => {
    renderWithRouter(<CatalogPage />);
    expect(screen.getByText('SEARCH')).toBeInTheDocument();
  });
});
