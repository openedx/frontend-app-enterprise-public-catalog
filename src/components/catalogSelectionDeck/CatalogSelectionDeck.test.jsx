import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { screen, getDefaultNormalizer } from '@testing-library/react';
import { SEARCH_FACET_FILTERS, SearchContext } from '@edx/frontend-enterprise-catalog-search';
import CatalogSelectionDeck from './CatalogSelectionDeck';
import { renderWithRouter } from '../tests/testUtils';
import messages from './CatalogSelectionDeck.messages';
import QUERY_TITLE_REFINEMENT from '../../constants';

const DEFAULT_SEARCH_CONTEXT_VALUE = { refinements: {} };

const mockConfig = () => (
  {
    EDX_FOR_BUSINESS_TITLE: 'ayylmao',
    EDX_FOR_ONLINE_EDU_TITLE: 'foo',
    EDX_ENTERPRISE_ALACARTE_TITLE: 'baz',
  }
);

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: () => mockConfig(),
}));

// eslint-disable-next-line react/prop-types
const SearchDataWrapper = ({ children, searchContextValue }) => (
  <SearchContext.Provider
    value={searchContextValue}
    searchFacetFilters={
        [...SEARCH_FACET_FILTERS, { attribute: QUERY_TITLE_REFINEMENT, title: 'Titles' }]
      }
  >
    {children}
  </SearchContext.Provider>
);

describe('CatalogSelectionDeck', () => {
  it('renders all cards', () => {
    renderWithRouter(
      <SearchDataWrapper
        searchContextValue={DEFAULT_SEARCH_CONTEXT_VALUE}
      >
        <CatalogSelectionDeck
          title="foo"
        />
      </SearchDataWrapper>,
    );
    Object.keys(messages).forEach((key) => {
      // Note: we just pick out the first match for this basic test because some messages appear more than once
      // e.g. both cards for Education and Business have some identical text.
      expect(screen.getAllByText(
        messages[key].defaultMessage,
        {
          normalizer:
            getDefaultNormalizer({ trim: false, collapseWhitespace: false }),
        },
      )[0])
        .toBeInTheDocument();
    });
  });
  it('renders title', () => {
    const label = 'foo';
    renderWithRouter(
      <SearchDataWrapper
        searchContextValue={DEFAULT_SEARCH_CONTEXT_VALUE}
      >
        <CatalogSelectionDeck
          title={label}
        />
      </SearchDataWrapper>,
    );
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
