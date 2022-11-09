import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  SEARCH_FACET_FILTERS,
  SearchContext,
} from '@edx/frontend-enterprise-catalog-search';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../tests/testUtils';
import QUERY_TITLE_REFINEMENT from '../../constants';
import CatalogSearch from './CatalogSearch';
import '../../../__mocks__/react-instantsearch-dom';

jest.mock('react-instantsearch-dom', () => ({
  ...jest.requireActual('react-instantsearch-dom'),
  InstantSearch: () => <div>SEARCH</div>,
  Index: () => <div>SEARCH</div>,
}));

const DEFAULT_SEARCH_CONTEXT_VALUE = { refinements: {} };
const COURSE_SEARCH_CONTEXT_VALUE = {
  refinements: { content_type: ['course'] },
};
const PROGRAM_SEARCH_CONTEXT_VALUE = {
  refinements: { content_type: ['program'] },
};

// eslint-disable-next-line react/prop-types
const SearchDataWrapper = ({ children, searchContextValue }) => (
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

describe('Catalog Search component', () => {
  it('properly renders component', () => {
    renderWithRouter(
      <SearchDataWrapper searchContextValue={DEFAULT_SEARCH_CONTEXT_VALUE}>
        <CatalogSearch />
      </SearchDataWrapper>,
    );
    expect(screen.getByText('SEARCH')).toBeInTheDocument();
  });
  it('properly renders component with program content type context', () => {
    renderWithRouter(
      <SearchDataWrapper searchContextValue={COURSE_SEARCH_CONTEXT_VALUE}>
        <CatalogSearch />
      </SearchDataWrapper>,
    );
    expect(screen.getByText('SEARCH')).toBeInTheDocument();
  });
  it('properly renders component with course content type context', () => {
    renderWithRouter(
      <SearchDataWrapper searchContextValue={PROGRAM_SEARCH_CONTEXT_VALUE}>
        <CatalogSearch />
      </SearchDataWrapper>,
    );
    expect(screen.getByText('SEARCH')).toBeInTheDocument();
  });
});
