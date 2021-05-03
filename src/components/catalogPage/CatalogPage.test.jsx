import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { renderWithRouter } from '../tests/testUtils';
import CatalogPage from './CatalogPage';
import messages from './CatalogPage.messages';
import selectionCardMessage from '../catalogSelectionDeck/CatalogSelectionDeck.messages';

// all we are testing is routes, we don't need InstantSearch to work here
jest.mock('react-instantsearch-dom', () => ({
  ...jest.requireActual('react-instantsearch-dom'),
  InstantSearch: () => (<div>SEARCH</div>),
}));

// Catalog Page loads the CTA button link which expects a config value.
// Thus we're mocking the config here.
const mockConfig = () => (
  {
    HUBSPOT_MARKETING_URL: 'http://bobsdooremporium.com',
    EDX_FOR_BUSINESS_UUID: 'ayylmao',
    EDX_FOR_ONLINE_EDU_UUID: 'foo',
    EDX_ONLINE_ESSENTIALS_UUID: 'bar',
  }
);

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: () => mockConfig(),
}));

describe('CatalogPage', () => {
  it('renders a catalog page component', () => {
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
  it('renders with catalog selection cards', () => {
    renderWithRouter(<CatalogPage />);
    expect(screen.getByText(selectionCardMessage['catalogSelectionDeck.edxForBusiness.label'].defaultMessage)).toBeInTheDocument();
  });
});
