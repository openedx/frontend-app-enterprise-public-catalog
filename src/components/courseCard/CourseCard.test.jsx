import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import CourseCard from './CourseCard';

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
}));

const TEST_CATALOG = ['ayylmao'];

const originalData = {
  title: 'Course Title',
  card_image_url: undefined,
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
    process.env.EDX_FOR_BUSINESS_TITLE = 'ayylmao';
    process.env.EDX_FOR_ONLINE_EDU_TITLE = 'foo';
    process.env.EDX_ENTERPRISE_ALACARTE_TITLE = 'baz';
    render(
      <IntlProvider locale="en">
        <CourseCard {...defaultProps} />
      </IntlProvider>,
    );
    expect(screen.queryByText(defaultProps.original.title)).toBeInTheDocument();
    expect(
      screen.queryByText(defaultProps.original.partners[0].name),
    ).toBeInTheDocument();
    expect(screen.queryByText('$100 • Available Now')).toBeInTheDocument();
    expect(screen.queryByText('Business')).toBeInTheDocument();
  });
  test('test card renders default image', async () => {
    render(
      <IntlProvider locale="en">
        <CourseCard {...defaultProps} />
      </IntlProvider>,
    );
    const imageAltText = `${originalData.title} course image`;
    fireEvent.error(screen.getByAltText(imageAltText));
    await expect(screen.getByAltText(imageAltText).src).not.toBeUndefined;
  });
});
