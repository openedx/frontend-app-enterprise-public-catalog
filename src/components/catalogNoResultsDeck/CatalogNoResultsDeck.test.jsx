import { IntlProvider } from '@edx/frontend-platform/i18n';
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { logError } from '@edx/frontend-platform/logging';

import CatalogNoResultsDeck from './CatalogNoResultsDeck';
import EnterpriseCatalogApiService from '../../data/services/EnterpriseCatalogAPIService';
import { getSelectedCatalogFromURL } from '../../utils/common';

const TEST_COURSE_NAME = 'test course';
const TEST_PARTNER = 'edx';
const TEST_CATALOGS = ['baz'];

const TEST_COURSE_NAME_2 = 'test course 2';
const TEST_PARTNER_2 = 'edx 2';
const TEST_CATALOGS_2 = ['baz', 'ayylmao'];

const csvData = {
  default_content: [
    {
      title: TEST_COURSE_NAME,
      partners: [{ name: TEST_PARTNER, logo_image_url: '' }],
      enterprise_catalog_query_titles: TEST_CATALOGS,
      card_image_url: 'http://url.test.location',
      first_enrollable_paid_seat_price: 100,
      original_image_url: '',
      availability: ['Available Now'],
    },
    {
      title: TEST_COURSE_NAME_2,
      partners: [{ name: TEST_PARTNER_2, logo_image_url: '' }],
      enterprise_catalog_query_titles: TEST_CATALOGS_2,
      card_image_url: 'http://url.test2.location',
      first_enrollable_paid_seat_price: 99,
      original_image_url: '',
      availability: ['Available Now'],
    },
  ],
};
// Enterprise catalog API mock
const mockCatalogApiService = jest.spyOn(
  EnterpriseCatalogApiService,
  'fetchDefaultCoursesInCatalogWithFacets',
);
// fetching catalog from query params mock
jest.mock('../../utils/common', () => ({
  ...jest.requireActual('../../utils/common'),
  getSelectedCatalogFromURL: jest.fn(),
}));

const defaultProps = {
  setCardView: jest.fn(),
  columns: [],
  renderCardComponent: jest.fn(),
  contentType: 'course',
  intl: {
    formatMessage: (header) => header.defaultMessage,
    formatDate: () => {},
    formatTime: () => {},
    formatRelative: () => {},
    formatNumber: () => {},
    formatPlural: () => {},
    formatHTMLMessasge: () => {},
    now: () => {},
  },
};

const execEdProps = {
  setCardView: jest.fn(),
  columns: [],
  renderCardComponent: jest.fn(),
  contentType: 'executive-education-2u',
  intl: {
    formatMessage: (header) => header.defaultMessage,
    formatDate: () => {},
    formatTime: () => {},
    formatRelative: () => {},
    formatNumber: () => {},
    formatPlural: () => {},
    formatHTMLMessasge: () => {},
    now: () => {},
  },
};

describe('catalog no results deck works as expected', () => {
  test('it displays no results alert text', async () => {
    mockCatalogApiService.mockResolvedValue(csvData);
    render(
      <IntlProvider locale="en">
        <CatalogNoResultsDeck {...defaultProps} />
      </IntlProvider>,
    );
    await act(() => screen.findByTestId('noResultsAlertTestId'));
    expect(screen.queryByTestId('noResultsAlertTestId')).toBeInTheDocument();
    await act(() => screen.findByText('No Results'));
    expect(screen.queryByText('No Results')).toBeInTheDocument();
  });

  test('clicking remove filters will update query params', async () => {
    getSelectedCatalogFromURL.mockReturnValue('ayylmao');
    render(
      <IntlProvider locale="en">
        <CatalogNoResultsDeck {...defaultProps} />
      </IntlProvider>,
    );
    await act(() => screen.findByText('removing filters'));
    const hyperlink = screen.getByText('removing filters');
    expect(hyperlink).toHaveAttribute(
      'href',
      `${process.env.BASE_URL}/?enterprise_catalog_query_titles=ayylmao`,
    );
  });

  test('API error responses will hide content deck', async () => {
    mockCatalogApiService.mockRejectedValue(new Error('Async error'));
    render(
      <IntlProvider locale="en">
        <CatalogNoResultsDeck {...defaultProps} />
      </IntlProvider>,
    );
    expect(
      await screen.findByTestId('noResultsDeckTitleTestId'),
    ).not.toBeInTheDocument();
    expect(logError).toBeCalled();
  });
  test('shows executive education alert text', async () => {
    render(
      <IntlProvider locale="en">
        <CatalogNoResultsDeck {...execEdProps} />
      </IntlProvider>,
    );
    await act(() => screen.findByText('No Executive Education courses were found that match your search. Try'));
    expect(screen.queryByText('No Executive Education courses were found that match your search. Try')).toBeInTheDocument();
  });
});
