import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import CourseCard from './CourseCard';

const originalData = {
  title: 'Course Title',
  card_image_url: '',
  partners: [{ logo_image_url: '', name: 'Course Provider' }],
  first_enrollable_paid_seat_price: 100,
  original_image_url: '',
  enterprise_catalog_query_titles: [],
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
  });
});
