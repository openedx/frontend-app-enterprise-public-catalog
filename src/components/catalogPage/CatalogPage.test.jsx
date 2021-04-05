import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { renderWithRouter } from '../tests/testUtils';
import CatalogPage from './CatalogPage';
import messages from './CatalogPage.messages';

// all we are testing is routes, we don't need InstantSearch to work here
jest.mock('react-instantsearch-dom', () => ({
  ...jest.requireActual('react-instantsearch-dom'),
  InstantSearch: () => (<div>SEARCH</div>),
}));

describe('CatalogPage', () => {
  it('renders a hero component', () => {
    const { container } = renderWithRouter(<CatalogPage />);
    expect(container.querySelector('.hero')).toBeInTheDocument();
  });
  it('renders a CTA component', () => {
    renderWithRouter(<CatalogPage />);
    expect(screen.getByText(messages['catalogPage.cta.button.text'].defaultMessage)).toBeInTheDocument();
  });
  it('renders the catalog search component', () => {
    renderWithRouter(<CatalogPage />);
    expect(screen.getByText('SEARCH')).toBeInTheDocument();
  });
});
