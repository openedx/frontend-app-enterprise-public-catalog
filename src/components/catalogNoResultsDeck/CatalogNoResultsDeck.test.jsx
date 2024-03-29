import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';

import { IntlProvider } from '@edx/frontend-platform/i18n';

import CatalogNoResultsDeck from './CatalogNoResultsDeck';
import { getSelectedCatalogFromURL } from '../../utils/common';

const TEST_COURSE_NAME = 'test course';
const TEST_PARTNER = 'edx';
const TEST_CATALOGS = ['baz'];

const TEST_COURSE_NAME_2 = 'test course 2';
const TEST_PARTNER_2 = 'edx 2';
const TEST_CATALOGS_2 = ['baz', 'ayylmao'];

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
  searchResults: {
    hits: [{
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
    }],
  },
};

const execEdProps = {
  setCardView: jest.fn(),
  columns: [],
  renderCardComponent: jest.fn(),
  contentType: 'Executive Education',
};

describe('catalog no results deck works as expected', () => {
  test('it displays no results alert text', async () => {
    render(
      <IntlProvider locale="en">
        <CatalogNoResultsDeck {...defaultProps} />
      </IntlProvider>,
    );

    await waitFor(() => { expect(screen.getByTestId('noResultsAlertTestId')); });
    await waitFor(() => { expect(screen.getByText('No Results')); });
  });
  test('clicking remove filters will update query params', async () => {
    getSelectedCatalogFromURL.mockReturnValue('ayylmao');
    render(
      <IntlProvider locale="en">
        <CatalogNoResultsDeck {...defaultProps} />
      </IntlProvider>,
    );
    await waitFor(() => {
      const hyperlink = screen.getByText('removing filters');
      expect(hyperlink).toHaveAttribute(
        'href',
        `${process.env.BASE_URL}/?enterprise_catalog_query_titles=ayylmao`,
      );
    });
  });
  test('shows executive education alert text', async () => {
    render(
      <IntlProvider locale="en">
        <CatalogNoResultsDeck {...execEdProps} />
      </IntlProvider>,
    );
    await waitFor(() => { expect(screen.getByText('No Executive Education courses were found that match your search. Try')); });
  });
});
