import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import CourseCard from './CourseCard';

const mockConfig = () => (
  {
    EDX_FOR_BUSINESS_TITLE: 'ayylmao',
    EDX_FOR_ONLINE_EDU_TITLE: 'foo',
    EDX_ENTERPRISE_ALACARTE_TITLE: 'baz',
    FEATURE_CARD_VIEW_ENABLED: 'True',
  }
);

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: () => mockConfig(),
}));

const TEST_CATALOG = ['ayylmao'];

const originalData = {
  title: 'Course Title',
  card_image_url: '',
  partners: [{ logo_image_url: '', name: 'Course Provider' }],
  first_enrollable_paid_seat_price: 100,
  original_image_url: '',
  enterprise_catalog_query_titles: TEST_CATALOG,
  availability: ['Available Now'],
};

const defaultProps = {
  original: originalData,
};

describe('Course card works as expected', () => {
  test('card renders as expected', () => {
    render(
      <IntlProvider locale="en">
        <CourseCard {...defaultProps} />
      </IntlProvider>,
    );
    expect(screen.queryByText(defaultProps.original.title)).toBeInTheDocument();
    expect(screen.queryByText(defaultProps.original.partners[0].name)).toBeInTheDocument();
    expect(screen.queryByText('$100 • Available Now')).toBeInTheDocument();
    // TODO: Badges commented out until Algolia bug is resolved (ENT-5338)
    // expect(screen.queryByText(TEST_CATALOGS[0]));
  });
});
