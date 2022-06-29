import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { mockWindowLocations, renderWithRouter } from '../tests/testUtils';
import CatalogPage from './CatalogPage';
import selectionCardMessage from '../catalogSelectionDeck/CatalogSelectionDeck.messages';

// all we are testing is routes, we don't need InstantSearch to work here
jest.mock('react-instantsearch-dom', () => ({
  ...jest.requireActual('react-instantsearch-dom'),
  InstantSearch: () => (<div>SEARCH</div>),
  Index: () => (<div>SEARCH</div>),
}));

// Catalog Page loads the CTA button link which expects a config value.
// Thus we're mocking the config here.
const mockConfig = () => (
  {
    HUBSPOT_MARKETING_URL: 'http://bobsdooremporium.com',
    EDX_FOR_BUSINESS_TITLE: 'ayylmao',
    EDX_FOR_ONLINE_EDU_TITLE: 'foo',
    EDX_ENTERPRISE_ALACARTE_TITLE: 'baz',
  }
);

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: () => mockConfig(),
}));

mockWindowLocations();

describe('CatalogPage', () => {
  it('renders a catalog page component', () => {
    const { container } = renderWithRouter(<CatalogPage />);
    expect(container.querySelector('.hero')).toBeInTheDocument();
  });
  it('renders the catalog search component', () => {
    renderWithRouter(<CatalogPage />);
    expect(screen.getByText('SEARCH')).toBeInTheDocument();
  });
  it('renders with catalog selection cards', () => {
    renderWithRouter(<CatalogPage />);
    expect(screen.getByText(selectionCardMessage['catalogSelectionDeck.edxForBusiness.label'].defaultMessage)).toBeInTheDocument();
  });
  it('properly handles empty query params', () => {
    const location = {
      ...window.location,
      search: '?q=',
    };
    Object.defineProperty(window, 'location', {
      writable: true,
      value: location,
    });
    expect(window.location.search).toEqual('?q=');
    renderWithRouter(<CatalogPage />);
    expect(window.location.search).toEqual('enterprise_catalog_query_titles=baz&availability=Available+Now&availability=Starting+Soon&availability=Upcoming');
  });
});
