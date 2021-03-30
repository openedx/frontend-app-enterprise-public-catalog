import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { SearchContext } from '@edx/frontend-enterprise';
import {
  BaseCatalogSearchResults, NO_DATA_MESSAGE, ERROR_MESSAGE, SKELETON_DATA_TESTID, TABLE_HEADERS,
} from '../CatalogSearchResults';

// Mocking this connected component so as not to have to mock the algolia Api
const PAGINATE_ME = 'PAGINATE ME :)';
const PaginationComponent = () => <div>{PAGINATE_ME}</div>;

const DEFAULT_SEARCH_CONTEXT_VALUE = { refinementsFromQueryParams: {} };

// eslint-disable-next-line react/prop-types
const SearchDataWrapper = ({ children, searchContextValue = DEFAULT_SEARCH_CONTEXT_VALUE }) => (
  <SearchContext.Provider value={searchContextValue}>
    {children}
  </SearchContext.Provider>
);

const TEST_COURSE_NAME = 'test course';
const TEST_SUBJECT = 'test subject';
const TEST_PARTNER = 'edx';

const TEST_COURSE_NAME_2 = 'test course 2';
const TEST_SUBJECT_2 = 'test subject 2';
const TEST_PARTNER_2 = 'edx 2';

const searchResults = {
  nbHits: 1,
  hitsPerPage: 10,
  pageIndex: 10,
  pageCount: 5,
  nbPages: 6,
  hits: [
    {
      title: TEST_COURSE_NAME,
      subjects: [TEST_SUBJECT],
      partners: [{ name: TEST_PARTNER }],
    },
    {
      title: TEST_COURSE_NAME_2,
      subjects: [TEST_SUBJECT_2],
      partners: [{ name: TEST_PARTNER_2 }],
    },
  ],
  page: 1,
};

describe('Main Catalogs view works as expected', () => {
  test('all courses rendered when search results available', () => {
    render(
      <SearchDataWrapper>
        <BaseCatalogSearchResults
          paginationComponent={PaginationComponent}
          searchResults={searchResults}
          isSearchStalled={false}
          searchState={{ page: 1 }}
          error={null}
        />
      </SearchDataWrapper>,
    );

    // course 1
    expect(screen.queryByText(TEST_COURSE_NAME)).toBeInTheDocument();
    expect(screen.queryByText(TEST_SUBJECT)).toBeInTheDocument();
    expect(screen.queryByText(TEST_PARTNER)).toBeInTheDocument();

    // course 2
    expect(screen.queryByText(TEST_COURSE_NAME_2)).toBeInTheDocument();
    expect(screen.queryByText(TEST_SUBJECT_2)).toBeInTheDocument();
    expect(screen.queryByText(TEST_PARTNER_2)).toBeInTheDocument();
  });
  test('pagination component renders', () => {
    render(
      <SearchDataWrapper>
        <BaseCatalogSearchResults
          paginationComponent={PaginationComponent}
          searchResults={searchResults}
          isSearchStalled={false}
          searchState={{ page: 1 }}
          error={null}
        />
      </SearchDataWrapper>,
    );
    expect(screen.queryByText(PAGINATE_ME)).toBeInTheDocument();
  });
  test('no search results displays NO_DATA_MESSAGE', () => {
    const emptySearchResults = { ...searchResults, nbHits: 0 };
    render(
      <SearchDataWrapper>
        <BaseCatalogSearchResults
          paginationComponent={PaginationComponent}
          searchResults={emptySearchResults}
          isSearchStalled={false}
          searchState={{ page: 1 }}
          error={null}
        />
      </SearchDataWrapper>,
    );
    expect(screen.queryByText(NO_DATA_MESSAGE)).toBeInTheDocument();
  });
  test('error if present is rendered instead of table', () => {
    const ERRMSG = 'something ain\'t right here';
    render(
      <SearchDataWrapper>
        <BaseCatalogSearchResults
          paginationComponent={PaginationComponent}
          searchResults={searchResults}
          isSearchStalled={false}
          searchState={{ page: 1 }}
          error={{ message: ERRMSG }}
        />
      </SearchDataWrapper>,
    );

    expect(screen.queryByRole('alert')).toBeInTheDocument();
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toBeVisible();
    expect(alertElement).toHaveTextContent(`${ERROR_MESSAGE}: ${ERRMSG}`);

    expect(screen.queryByText(TEST_COURSE_NAME)).not.toBeInTheDocument();
    expect(screen.queryByText(TEST_COURSE_NAME_2)).not.toBeInTheDocument();
  });
  test('isSearchStalled leads to rendering skeleton and not content', () => {
    render(
      <SearchDataWrapper>
        <BaseCatalogSearchResults
          paginationComponent={PaginationComponent}
          searchResults={searchResults}
          isSearchStalled
          searchState={{ page: 1 }}
        />
      </SearchDataWrapper>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(TEST_COURSE_NAME)).not.toBeInTheDocument();
    expect(screen.getByTestId(SKELETON_DATA_TESTID)).toBeInTheDocument();
  });
  test('headers rendered correctly', () => {
    render(
      <SearchDataWrapper>
        <BaseCatalogSearchResults
          paginationComponent={PaginationComponent}
          searchResults={searchResults}
          isSearchStalled={false}
          searchState={{ page: 1 }}
          error={null}
        />
      </SearchDataWrapper>,
    );
    expect(screen.queryByText(TABLE_HEADERS.courseName)).toBeInTheDocument();
    expect(screen.queryByText(TABLE_HEADERS.partner)).toBeInTheDocument();
    expect(screen.queryByText(TABLE_HEADERS.subject)).toBeInTheDocument();
  });
});
