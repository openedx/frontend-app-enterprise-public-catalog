import React from 'react';
import {
  act, render, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import { SearchContext } from '@edx/frontend-enterprise-catalog-search';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import {
  BaseCatalogSearchResults,
  ERROR_MESSAGE,
  SKELETON_DATA_TESTID,
} from './CatalogSearchResults';
import { renderWithRouter } from '../tests/testUtils';
import messages from './CatalogSearchResults.messages';
import {
  CONTENT_TYPE_COURSE,
  CONTENT_TYPE_PROGRAM,
  EXEC_ED_TITLE,
  HIDE_PRICE_REFINEMENT,
} from '../../constants';
import features from '../../config';

// Mocking this connected component so as not to have to mock the algolia Api
const PAGINATE_ME = 'PAGINATE ME :)';
const PaginationComponent = () => <div>{PAGINATE_ME}</div>;

// all we are testing is routes, we don't need InstantSearch to work here
jest.mock('react-instantsearch-dom', () => ({
  ...jest.requireActual('react-instantsearch-dom'),
  InstantSearch: () => <div>Popular Courses</div>,
  Index: () => <div>Popular Courses</div>,
}));

const DEFAULT_SEARCH_CONTEXT_VALUE = { refinements: {} };

const SearchDataWrapper = ({
  // eslint-disable-next-line react/prop-types
  children,
  // eslint-disable-next-line react/prop-types
  searchContextValue = DEFAULT_SEARCH_CONTEXT_VALUE,
}) => (
  <SearchContext.Provider value={searchContextValue}>
    {children}
  </SearchContext.Provider>
);

const mockConfig = () => ({
  EDX_FOR_SUBSCRIPTION_TITLE: 'ayylmao',
  EDX_ENTERPRISE_ALACARTE_TITLE: 'baz',
  FEATURE_CARD_VIEW_ENABLED: 'True',
});

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: () => mockConfig(),
}));

const TEST_COURSE_NAME = 'test course';
const TEST_PARTNER = 'edx';
const TEST_CATALOGS = ['baz'];

const TEST_COURSE_NAME_2 = 'test course 2';
const TEST_PARTNER_2 = 'edx 2';
const TEST_CATALOGS_2 = ['baz', 'ayylmao'];

const TEST_PROGRAM_NAME = 'test program';

const TEST_EXEC_ED_NAME = 'test exec ed';

const searchResults = {
  nbHits: 2,
  hitsPerPage: 10,
  pageIndex: 10,
  pageCount: 5,
  nbPages: 6,
  hits: [
    {
      title: TEST_COURSE_NAME,
      partners: [{ name: TEST_PARTNER, logo_image_url: '' }],
      enterprise_catalog_query_titles: TEST_CATALOGS,
      card_image_url: 'http://url.test.location',
      first_enrollable_paid_seat_price: 100,
      original_image_url: '',
      availability: ['Available Now'],
      content_type: CONTENT_TYPE_COURSE,
      advertised_course_run: {
        start: '2020-01-24T05:00:00Z',
        end: '2080-01-01T17:00:00Z',
        upgrade_deadline: 1892678399,
        pacing_type: 'self_paced',
      },
      normalized_metadata: {
        content_price: 100,
      },
    },
    {
      title: TEST_COURSE_NAME_2,
      partners: [{ name: TEST_PARTNER_2, logo_image_url: '' }],
      enterprise_catalog_query_titles: TEST_CATALOGS_2,
      card_image_url: 'http://url.test2.location',
      first_enrollable_paid_seat_price: 99,
      original_image_url: '',
      availability: ['Available Now'],
      content_type: CONTENT_TYPE_COURSE,
      advertised_course_run: {
        start: '2020-01-24T05:00:00Z',
        end: '2080-01-01T17:00:00Z',
        upgrade_deadline: 1892678399,
        pacing_type: 'self_paced',
      },
      normalized_metadata: {
        content_price: 99,
      },
    },
  ],
  page: 1,
  _state: { disjunctiveFacetsRefinements: { foo: 'bar' } },
};

const searchResultsPrograms = {
  nbHits: 1,
  hitsPerPage: 10,
  pageIndex: 10,
  pageCount: 5,
  nbPages: 6,
  hits: [
    {
      title: TEST_PROGRAM_NAME,
      authoring_organizations: [{ name: TEST_PARTNER, logo_image_url: '' }],
      enterprise_catalog_query_titles: TEST_CATALOGS,
      card_image_url: 'http://url.test2.location',
      availability: ['Available Now'],
      course_keys: [],
      content_type: CONTENT_TYPE_PROGRAM,
    },
  ],
  page: 1,
  _state: { disjunctiveFacetsRefinements: { foo: 'bar' } },
};

const searchResultsExecEd = {
  nbHits: 1,
  hitsPerPage: 10,
  pageIndex: 10,
  pageCount: 5,
  nbPages: 6,
  hits: [
    {
      title: TEST_EXEC_ED_NAME,
      partners: [{ name: TEST_PARTNER, logo_image_url: '' }],
      authoring_organizations: [{ name: TEST_PARTNER, logo_image_url: '' }],
      enterprise_catalog_query_titles: TEST_CATALOGS,
      card_image_url: 'http://url.test2.location',
      availability: ['Available Now'],
      course_keys: [],
      content_type: EXEC_ED_TITLE,
      entitlements: [{ price: '100.00' }],
      advertised_course_run: {
        start: '2020-01-24T05:00:00Z',
        end: '2080-01-01T17:00:00Z',
        upgrade_deadline: 1892678399,
        pacing_type: 'self_paced',
      },
      additional_metadata: {
        start_date: '2020-01-24T05:00:00Z',
        end_date: '2080-01-01T17:00:00Z',
      },
      normalized_metadata: {
        content_price: 100,
      },
    },
  ],
  page: 1,
  _state: { disjunctiveFacetsRefinements: { foo: 'bar' } },
};

const defaultProps = {
  paginationComponent: PaginationComponent,
  searchResults,
  isSearchStalled: false,
  searchState: { page: 1 },
  error: null,
  contentType: CONTENT_TYPE_COURSE,
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

const programProps = {
  paginationComponent: PaginationComponent,
  searchResults,
  isSearchStalled: false,
  searchState: { page: 1 },
  error: null,
  contentType: CONTENT_TYPE_PROGRAM,
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

const execEdProps = {
  paginationComponent: PaginationComponent,
  searchResults,
  isSearchStalled: false,
  searchState: { page: 1 },
  error: null,
  contentType: EXEC_ED_TITLE,
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

describe('Main Catalogs view works as expected', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });
  afterEach(() => {
    process.env = OLD_ENV; // Restore old environment
    features.CONSOLIDATE_SUBS_CATALOG = true;
  });

  test('all courses rendered when search results available', async () => {
    process.env.EDX_FOR_SUBSCRIPTION_TITLE = 'ayylmao';
    process.env.EDX_ENTERPRISE_ALACARTE_TITLE = 'baz';
    render(
      <SearchDataWrapper>
        <IntlProvider locale="en">
          <BaseCatalogSearchResults {...defaultProps} />
        </IntlProvider>
        ,
      </SearchDataWrapper>,
    );

    // Card view should be default
    const listViewToggleButton = screen.getByLabelText('Card');
    const user = userEvent.setup();
    await user.click(listViewToggleButton);

    // course 1
    expect(screen.queryByText(TEST_COURSE_NAME)).toBeInTheDocument();
    expect(screen.queryByText(TEST_PARTNER)).toBeInTheDocument();

    // course 2
    expect(screen.queryByText(TEST_COURSE_NAME_2)).toBeInTheDocument();
    expect(screen.queryByText(TEST_PARTNER_2)).toBeInTheDocument();

    expect(screen.queryAllByText('A la carte').length === 2);
    expect(screen.queryByText('Subscription')).toBeInTheDocument();
  });
  test('all courses rendered when search results available', async () => {
    process.env.EDX_FOR_SUBSCRIPTION_TITLE = 'ayylmao';
    process.env.EDX_ENTERPRISE_ALACARTE_TITLE = 'baz';
    features.CONSOLIDATE_SUBS_CATALOG = false;
    render(
      <SearchDataWrapper>
        <IntlProvider locale="en">
          <BaseCatalogSearchResults {...defaultProps} />
        </IntlProvider>
        ,
      </SearchDataWrapper>,
    );

    // Card view should be default
    const listViewToggleButton = screen.getByLabelText('Card');
    const user = userEvent.setup();
    await user.click(listViewToggleButton);

    expect(screen.queryByText('Subscription')).toBeInTheDocument();
  });
  test('all courses rendered in card view when search results available', () => {
    render(
      <SearchDataWrapper>
        <IntlProvider locale="en">
          <BaseCatalogSearchResults {...defaultProps} />
        </IntlProvider>
        ,
      </SearchDataWrapper>,
    );

    // view selection toggle buttons
    expect(screen.getByLabelText('Card')).toBeVisible();
    expect(screen.getByLabelText('List')).toBeVisible();

    // since card view feature is on, card view should be the default!
    const table = screen.queryByRole('table');
    expect(table).not.toBeInTheDocument();

    // expect at least one of the course cards is rendered correctly
    const courseTitleInCard = screen.queryByText(TEST_COURSE_NAME);
    expect(courseTitleInCard).toBeVisible();

    // course 1 image with the correct alt text
    expect(
      screen.getByAltText(`${TEST_COURSE_NAME} course image`),
    ).toBeVisible();
  });
  test('pagination component renders', () => {
    renderWithRouter(
      <SearchDataWrapper>
        <BaseCatalogSearchResults {...defaultProps} />
      </SearchDataWrapper>,
    );
    expect(screen.queryByText(PAGINATE_ME)).toBeInTheDocument();
  });
  test('error if present is rendered instead of table', () => {
    const ERRMSG = "something ain't right here";
    renderWithRouter(
      <SearchDataWrapper>
        <BaseCatalogSearchResults
          {...defaultProps}
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
    renderWithRouter(
      <SearchDataWrapper>
        <BaseCatalogSearchResults {...defaultProps} isSearchStalled />
      </SearchDataWrapper>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(TEST_COURSE_NAME)).not.toBeInTheDocument();
    expect(screen.getByTestId(SKELETON_DATA_TESTID)).toBeInTheDocument();
  });
  test('headers rendered correctly', async () => {
    renderWithRouter(
      <SearchDataWrapper>
        <BaseCatalogSearchResults {...defaultProps} />
      </SearchDataWrapper>,
    );

    // switch to table view instead of card
    const listViewToggleButton = screen.getByLabelText('List');
    const user = userEvent.setup();
    await user.click(listViewToggleButton);

    expect(
      screen.queryByText(
        messages['catalogSearchResults.table.courseName'].defaultMessage,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        messages['catalogSearchResults.table.catalogs'].defaultMessage,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        messages['catalogSearchResults.table.partner'].defaultMessage,
      ),
    ).toBeInTheDocument();
    // fixes the act warnings by ensuring we await some UI state before returning from the test
    expect(
      await screen.findByText(
        messages['catalogSearchResults.table.price'].defaultMessage,
      ),
    ).toBeInTheDocument();
  });
  test('refinements hide price column and show availability', async () => {
    const refinements = {
      refinements: { [HIDE_PRICE_REFINEMENT]: 'true' },
    };
    renderWithRouter(
      <SearchDataWrapper searchContextValue={refinements}>
        <BaseCatalogSearchResults {...defaultProps} />
      </SearchDataWrapper>,
    );
    const listViewToggleButton = screen.getByLabelText('List');
    const user = userEvent.setup();
    await user.click(listViewToggleButton);

    await waitFor(() => expect(
      screen.queryByText(
        messages['catalogSearchResults.table.courseName'].defaultMessage,
      ),
    ).toBeInTheDocument());
    await waitFor(() => expect(
      screen.queryByText(
        messages['catalogSearchResults.table.catalogs'].defaultMessage,
      ),
    ).toBeInTheDocument());
    await waitFor(() => expect(
      screen.queryByText(
        messages['catalogSearchResults.table.partner'].defaultMessage,
      ),
    ).toBeInTheDocument());
    // fixes the act warnings by ensuring we await some UI state before returning from the test
    await waitFor(() => expect(
      screen.queryByText(
        messages['catalogSearchResults.table.availability'].defaultMessage,
      ),
    ).toBeInTheDocument());
  });
  test('testing list course modal pops up ', async () => {
    renderWithRouter(
      <SearchDataWrapper>
        <IntlProvider locale="en">
          <BaseCatalogSearchResults {...defaultProps} />
        </IntlProvider>
        ,
      </SearchDataWrapper>,
    );

    const listViewToggleButton = screen.getByLabelText('List');
    const user = userEvent.setup();
    await user.click(listViewToggleButton);

    const courseTitle = screen.getByText('test course');
    await user.click(courseTitle);

    await waitFor(() => expect(screen.queryByText('Session ends Jan 1, 2080')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('About this course')).toBeInTheDocument());
  });
  test('testing card course modal pops up ', async () => {
    renderWithRouter(
      <SearchDataWrapper>
        <IntlProvider locale="en">
          <BaseCatalogSearchResults {...defaultProps} />
        </IntlProvider>
        ,
      </SearchDataWrapper>,
    );

    // click course card
    const courseTitle = screen.getByText('test course');
    const user = userEvent.setup();
    await user.click(courseTitle);
    await waitFor(() => expect(screen.queryByText('A la carte course price')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Session ends Jan 1, 2080')).toBeInTheDocument());
    await act(() => screen.findByText('About this course'));
    await waitFor(() => expect(screen.queryByText('About this course')).toBeInTheDocument());
  });
  test('exec ed search results text and card price', async () => {
    process.env.EDX_FOR_SUBSCRIPTION_TITLE = 'ayylmao';
    process.env.EDX_ENTERPRISE_ALACARTE_TITLE = 'baz';
    renderWithRouter(
      <SearchDataWrapper>
        <BaseCatalogSearchResults
          {...execEdProps}
          searchResults={searchResultsExecEd}
        />
      </SearchDataWrapper>,
    );
    await waitFor(() => expect(screen.queryByText('Executive Education')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(
      'Immersive, instructor led online short courses designed to develop interpersonal, analytical, and critical thinking skills.',
    )).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('New')).toBeInTheDocument());

    // click exec ed course card
    const courseTitle = screen.getByText(TEST_EXEC_ED_NAME);
    const user = userEvent.setup();
    await user.click(courseTitle);
    await waitFor(() => expect(screen.queryByText('$100')).toBeInTheDocument());
  });
  test('all programs rendered when search results available', () => {
    process.env.EDX_FOR_SUBSCRIPTION_TITLE = 'ayylmao';
    process.env.EDX_ENTERPRISE_ALACARTE_TITLE = 'baz';

    renderWithRouter(
      <SearchDataWrapper>
        <BaseCatalogSearchResults
          {...programProps}
          searchResults={searchResultsPrograms}
        />
      </SearchDataWrapper>,
    );

    expect(screen.queryByText(TEST_PROGRAM_NAME)).toBeInTheDocument();
    expect(screen.queryByText(TEST_PARTNER)).toBeInTheDocument();
    expect(
      screen.queryByText('Courses available upon enrollment'),
    ).toBeInTheDocument();
    // TODO: Badges commented out until Algolia bug is resolved (ENT-5338)
    // expect(screen.queryByText(TEST_CATALOGS[0])).toBeInTheDocument();
  });
  test('testing program switch to table view ', async () => {
    renderWithRouter(
      <SearchDataWrapper>
        <BaseCatalogSearchResults
          {...programProps}
          searchResults={searchResultsPrograms}
        />
      </SearchDataWrapper>,
    );

    // switch to table view instead of card
    const listViewToggleButton = screen.getByLabelText('List');
    const user = userEvent.setup();
    await user.click(listViewToggleButton);

    expect(
      screen.queryByText(
        messages['catalogSearchResults.table.programName'].defaultMessage,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        messages['catalogSearchResults.table.numCourses'].defaultMessage,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        messages['catalogSearchResults.table.programType'].defaultMessage,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        messages['catalogSearchResults.table.partner'].defaultMessage,
      ),
    ).toBeInTheDocument();
  });

  test('no course search results displays popular course text', () => {
    const emptySearchResults = { ...searchResults, nbHits: 0 };
    renderWithRouter(
      <IntlProvider locale="en">
        <SearchDataWrapper>
          <BaseCatalogSearchResults
            {...defaultProps}
            searchResults={emptySearchResults}
          />
        </SearchDataWrapper>
      </IntlProvider>,
    );
    const textComponent = screen.getAllByText('Popular Courses')[0];
    expect(textComponent).toBeInTheDocument();
  });
});
