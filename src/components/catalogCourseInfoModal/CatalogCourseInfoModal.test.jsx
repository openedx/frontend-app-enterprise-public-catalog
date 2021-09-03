import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import CatalogCourseInfoModal from './CatalogCourseInfoModal';

const descriptionText = 'this is a description';
// course descriptions are injected into the DOM with dangerouslySetInnerHTML
const descriptionHtml = `<p>${descriptionText}</p>`;
const defaultProps = {
  isOpen: true,
  courseTitle: 'Course Title',
  courseProvider: 'Course Provider',
  coursePrice: '100',
  courseAssociatedCatalogs: [],
  courseDescription: descriptionHtml,
  partnerLogoImageUrl: '',
  bannerImageUrl: '',
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

describe('Course info modal works as expected', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });
  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });
  test('modal renders when expected', () => {
    render(
      <IntlProvider locale="en">
        <CatalogCourseInfoModal {...defaultProps} />
      </IntlProvider>,
    );
    expect(screen.queryByText(defaultProps.courseTitle)).toBeInTheDocument();
    expect(screen.queryByText(defaultProps.courseProvider)).toBeInTheDocument();
    expect(screen.queryByText(descriptionText)).toBeInTheDocument();
  });

  test('modal is hidden when expected', () => {
    let defaultPropsCopy = {};
    Object.assign(defaultPropsCopy, defaultProps);
    defaultPropsCopy.isOpen = false;
    render(
      <IntlProvider locale="en">
        <CatalogCourseInfoModal {...defaultPropsCopy} />
      </IntlProvider>,
    );
    expect(screen.queryByText(defaultProps.courseTitle)).not.toBeInTheDocument();
  });
  test('modal displays appropriate associated catalog badges', () => {
    let defaultPropsCopy = {};
    Object.assign(defaultPropsCopy, defaultProps);

    const educationQueryUuid = 'test-business-query-uuid';
    process.env.EDX_FOR_ONLINE_EDU_UUID = educationQueryUuid;
    defaultPropsCopy.courseAssociatedCatalogs = [educationQueryUuid];

    render(
      <IntlProvider locale="en">
        <CatalogCourseInfoModal {...defaultPropsCopy} />
      </IntlProvider>,
    );
    expect(screen.queryByText('Education')).toBeInTheDocument();
    expect(screen.queryByText('A la carte')).toBeInTheDocument();
    expect(screen.queryByText('Business')).not.toBeInTheDocument();
  });
});
