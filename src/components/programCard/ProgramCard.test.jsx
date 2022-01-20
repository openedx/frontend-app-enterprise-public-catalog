import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import ProgramCard from './ProgramCard';

const originalData = {
  title: 'Program Title',
  card_image_url: '',
  course_keys: ['edx+123', 'edx-321'],
  authoring_organizations: [{ logo_image_url: '', name: 'Course Provider' }],
  program_type: 'Professional Certificate',
  enterprise_catalog_query_titles: [],
};

const defaultProps = {
  original: originalData,
};

describe('Program card works as expected', () => {
  test('card renders as expected', () => {
    render(
      <IntlProvider locale="en">
        <ProgramCard {...defaultProps} />
      </IntlProvider>,
    );
    expect(screen.queryByText(defaultProps.original.title)).toBeInTheDocument();
    expect(screen.queryByText(defaultProps.original.authoring_organizations[0].name)).toBeInTheDocument();
    expect(screen.queryByText(defaultProps.original.program_type)).toBeInTheDocument();
    expect(screen.queryByText('2 Courses')).toBeInTheDocument();
  });
});
