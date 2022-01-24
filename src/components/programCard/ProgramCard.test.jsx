import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import ProgramCard from './ProgramCard';

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
  title: 'Program Title',
  card_image_url: '',
  course_keys: ['edx+123', 'edx-321'],
  authoring_organizations: [{ logo_image_url: '', name: 'Course Provider' }],
  program_type: 'Professional Certificate',
  enterprise_catalog_query_titles: TEST_CATALOG,
};

const defaultProps = {
  original: originalData,
};

describe('Program card works as expected', () => {
  test('card renders as expected', () => {
    process.env.EDX_FOR_BUSINESS_TITLE = 'ayylmao';
    process.env.EDX_FOR_ONLINE_EDU_TITLE = 'foo';
    process.env.EDX_ENTERPRISE_ALACARTE_TITLE = 'baz';
    render(
      <IntlProvider locale="en">
        <ProgramCard {...defaultProps} />
      </IntlProvider>,
    );
    expect(screen.queryByText(defaultProps.original.title)).toBeInTheDocument();
    expect(screen.queryByText(defaultProps.original.authoring_organizations[0].name)).toBeInTheDocument();
    expect(screen.queryByText(defaultProps.original.program_type)).toBeInTheDocument();
    expect(screen.queryByText('2 Courses')).toBeInTheDocument();
    expect(screen.queryByText('Business'));
  });
});
