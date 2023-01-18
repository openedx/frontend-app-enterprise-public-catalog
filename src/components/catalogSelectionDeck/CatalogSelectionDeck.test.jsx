import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/react';
import {
  SEARCH_FACET_FILTERS,
  SearchContext,
} from '@edx/frontend-enterprise-catalog-search';
import CatalogSelectionDeck from './CatalogSelectionDeck';
import { renderWithRouter } from '../tests/testUtils';
import QUERY_TITLE_REFINEMENT from '../../constants';

const BUSINESS_SEARCH_CONTEXT_VALUE = {
  refinements: { enterprise_catalog_query_titles: ['Business'] },
};

const mockConfig = () => ({
  EDX_FOR_BUSINESS_TITLE: 'ayylmao',
  EDX_FOR_ONLINE_EDU_TITLE: 'foo',
  EDX_ENTERPRISE_ALACARTE_TITLE: 'baz',
});

const label = 'fefifofum';

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: () => mockConfig(),
}));

const defaultProps = {
  title: label,
  // mock i18n requirements
  intl: {
    formatMessage: (header) => header.defaultMessage,
    formatDate: () => {},
    formatTime: () => {},
    formatRelative: () => {},
    formatNumber: () => {},
    formatPlural: () => {},
    formatHTMLMessage: () => {},
    now: () => {},
  },
};

// eslint-disable-next-line react/prop-types
function SearchDataWrapper({ children, searchContextValue }) {
  return (
    <SearchContext.Provider
      value={searchContextValue}
      searchFacetFilters={[
        ...SEARCH_FACET_FILTERS,
        { attribute: QUERY_TITLE_REFINEMENT, title: 'Titles' },
      ]}
    >
      {children}
    </SearchContext.Provider>
  );
}

describe('CatalogSelectionDeck', () => {
  it('renders all cards', () => {
    renderWithRouter(
      <SearchDataWrapper searchContextValue={BUSINESS_SEARCH_CONTEXT_VALUE}>
        <CatalogSelectionDeck {...defaultProps} />
      </SearchDataWrapper>,
    );
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
