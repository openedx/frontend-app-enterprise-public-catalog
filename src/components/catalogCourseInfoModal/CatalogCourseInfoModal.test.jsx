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
  startDate: '2021-09-15T16:00:00Z',
  endDate: '2022-04-06T16:00:00Z',
  upcomingRuns: 2,
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
    const defaultPropsCopy = {};
    Object.assign(defaultPropsCopy, defaultProps);
    defaultPropsCopy.isOpen = false;
    render(
      <IntlProvider locale="en">
        <CatalogCourseInfoModal {...defaultPropsCopy} />
      </IntlProvider>,
    );
    expect(screen.queryByText(defaultProps.courseTitle)).not.toBeInTheDocument();
  });
  test('Renders modal banner', () => {
    const defaultPropsCopy = {};
    Object.assign(defaultPropsCopy, defaultProps);

    render(
      <IntlProvider locale="en">
        <CatalogCourseInfoModal {...defaultPropsCopy} />
      </IntlProvider>,
    );
    expect(screen.queryByText('A la carte course price')).toBeInTheDocument();
    expect(screen.queryByText('Session ends Apr 6, 2022 • 2 additional session(s)')).toBeInTheDocument();
    expect(screen.queryByText('Included with subscription')).not.toBeInTheDocument();
  });
  test('Renders modal with correct catalogs', () => {
    const defaultPropsCopy = {};
    Object.assign(defaultPropsCopy, defaultProps);

    const educationQueryTitle = 'test-business-query-title';
    process.env.EDX_FOR_ONLINE_EDU_TITLE = educationQueryTitle;
    defaultPropsCopy.courseAssociatedCatalogs = [educationQueryTitle];

    render(
      <IntlProvider locale="en">
        <CatalogCourseInfoModal {...defaultPropsCopy} />
      </IntlProvider>,
    );
    expect(screen.queryByText('Included in education catalog')).toBeInTheDocument();
    expect(screen.queryByText('Included in business catalog')).not.toBeInTheDocument();
  });
  test('Renders modal with no catalogs', () => {
    const defaultPropsCopy = {};
    Object.assign(defaultPropsCopy, defaultProps);

    render(
      <IntlProvider locale="en">
        <CatalogCourseInfoModal {...defaultPropsCopy} />
      </IntlProvider>,
    );
    expect(screen.queryByText('Included with subscription')).not.toBeInTheDocument();
  });
  test('modal displays up to 5 skills list', () => {
    const defaultPropsCopy = {
      ...defaultProps,
      skillNames: [...Array(20).keys()].map(i => `skill-${i}`),
    };

    render(
      <IntlProvider locale="en">
        <CatalogCourseInfoModal {...defaultPropsCopy} />
      </IntlProvider>,
    );
    expect(screen.queryByText('Related skills')).toBeInTheDocument();

    expect(screen.queryByText('skill-0')).toBeInTheDocument();
    expect(screen.queryByText('skill-1')).toBeInTheDocument();
    expect(screen.queryByText('skill-2')).toBeInTheDocument();
    expect(screen.queryByText('skill-3')).toBeInTheDocument();
    expect(screen.queryByText('skill-4')).toBeInTheDocument();
    expect(screen.queryByText('skill-5')).not.toBeInTheDocument();
    expect(screen.queryByText('skill-10')).not.toBeInTheDocument();
  });
  test('modal displays no skills listing if skills not found', () => {
    const defaultPropsCopy = {
      ...defaultProps,
    };

    render(
      <IntlProvider locale="en">
        <CatalogCourseInfoModal {...defaultPropsCopy} />
      </IntlProvider>,
    );
    expect(screen.queryByText('Related skills')).not.toBeInTheDocument();
  });
});
