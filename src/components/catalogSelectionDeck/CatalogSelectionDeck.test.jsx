import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { screen, getDefaultNormalizer } from '@testing-library/react';
import {
  SEARCH_FACET_FILTERS,
  SearchContext,
} from '@edx/frontend-enterprise-catalog-search';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import CatalogSelectionDeck from './CatalogSelectionDeck';
import { renderWithRouter } from '../tests/testUtils';
import QUERY_TITLE_REFINEMENT from '../../constants';
import messages from './CatalogSelectionDeck.messages';

const BUSINESS_SEARCH_CONTEXT_VALUE = {
  refinements: { enterprise_catalog_query_titles: ['ayylmao'] },
};

const label = 'fefifofum';

jest.mock('@edx/frontend-platform/config', () => ({
  ...jest.requireActual('@edx/frontend-platform/config'),
  getConfig: jest.fn(() => ({
    EDX_FOR_BUSINESS_TITLE: 'ayylmao',
    EDX_FOR_ONLINE_EDU_TITLE: 'foo',
    EDX_ENTERPRISE_ALACARTE_TITLE: 'baz',
  })),
}));

// eslint-disable-next-line react/prop-types
function SearchDataWrapper({ children, searchContextValue }) {
  return (
    <IntlProvider locale="en">
      <SearchContext.Provider
        value={searchContextValue}
        searchFacetFilters={[
          ...SEARCH_FACET_FILTERS,
          { attribute: QUERY_TITLE_REFINEMENT, title: 'Titles' },
        ]}
      >
        {children}
      </SearchContext.Provider>
    </IntlProvider>
  );
}

describe('CatalogSelectionDeck', () => {
  it('renders all cards', () => {
    renderWithRouter(
      <SearchDataWrapper searchContextValue={BUSINESS_SEARCH_CONTEXT_VALUE}>
        <CatalogSelectionDeck title={label} />
      </SearchDataWrapper>,
    );
    expect(screen.getByText(label)).toBeInTheDocument();
    Object.keys(messages).forEach((key) => {
      // Note: we just pick out the first match for this basic test because some messages appear more than once
      // e.g. both cards for Education and Business have some identical text.
      expect(
        screen.getAllByText(messages[key].defaultMessage, {
          normalizer: getDefaultNormalizer({
            trim: false,
            collapseWhitespace: false,
          }),
        })[0],
      ).toBeInTheDocument();
    });
  });
});
