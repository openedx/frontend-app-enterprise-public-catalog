import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import CatalogInfoModal from './CatalogInfoModal';

const descriptionText = 'this is a description';
// course descriptions are injected into the DOM with dangerouslySetInnerHTML
const descriptionHtml = `<p>${descriptionText}</p>`;
const courseTypeModalProps = {
  isOpen: true,
  selectedCourse: {
    courseTitle: 'Course Title',
    courseProvider: 'Course Provider',
    coursePrice: '100',
    courseAssociatedCatalogs: [],
    courseDescription: descriptionHtml,
    partnerLogoImageUrl: '',
    bannerImageUrl: '',
    startDate: '2021-09-15T16:00:00Z',
    endDate: '2040-04-06T16:00:00Z',
    upcomingRuns: 2,
    marketingUrl: 'http://someurl',
    skillNames: [],
  },

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
  const { selectedCourse } = courseTypeModalProps;
  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });
  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });
  test('Course info modal renders when expected', () => {
    render(
      <IntlProvider locale="en">
        <CatalogInfoModal {...courseTypeModalProps} />
      </IntlProvider>,
    );

    expect(screen.queryByText(selectedCourse.courseTitle)).toBeInTheDocument();
    expect(screen.queryByText(selectedCourse.courseProvider)).toBeInTheDocument();
    expect(screen.queryByText(descriptionText)).toBeInTheDocument();
  });
  test('Course info modal is hidden when expected', () => {
    const defaultPropsCopy = {};
    Object.assign(defaultPropsCopy, courseTypeModalProps);
    defaultPropsCopy.isOpen = false;
    render(
      <IntlProvider locale="en">
        <CatalogInfoModal {...defaultPropsCopy} />
      </IntlProvider>,
    );
    expect(screen.queryByText(selectedCourse.courseTitle)).not.toBeInTheDocument();
  });
  test('Renders Course info modal banner', () => {
    const defaultPropsCopy = {};
    Object.assign(defaultPropsCopy, courseTypeModalProps);

    render(
      <IntlProvider locale="en">
        <CatalogInfoModal {...defaultPropsCopy} />
      </IntlProvider>,
    );
    expect(screen.queryByText('A la carte course price')).toBeInTheDocument();
    expect(screen.queryByText('Session ends Apr 6, 2040 • 2 additional session(s)')).toBeInTheDocument();
    expect(screen.queryByText('Included with subscription')).not.toBeInTheDocument();
  });
  test('Renders Course info modal with correct catalogs', () => {
    const defaultPropsCopy = {};
    Object.assign(defaultPropsCopy, courseTypeModalProps);

    const educationQueryTitle = 'test-business-query-title';
    process.env.EDX_FOR_ONLINE_EDU_TITLE = educationQueryTitle;
    defaultPropsCopy.selectedCourse.courseAssociatedCatalogs = [educationQueryTitle];

    render(
      <IntlProvider locale="en">
        <CatalogInfoModal {...defaultPropsCopy} />
      </IntlProvider>,
    );
    expect(screen.queryByText('Included in education catalog')).toBeInTheDocument();
    expect(screen.queryByText('Included in business catalog')).not.toBeInTheDocument();
  });
  test('Renders Course info modal with no catalogs', () => {
    const defaultPropsCopy = {};
    Object.assign(defaultPropsCopy, courseTypeModalProps);

    render(
      <IntlProvider locale="en">
        <CatalogInfoModal {...defaultPropsCopy} />
      </IntlProvider>,
    );
    expect(screen.queryByText('Included with subscription')).not.toBeInTheDocument();
  });
  test('Course info modal displays up to 5 skills list', () => {
    const defaultPropsCopy = {
      ...courseTypeModalProps,
      selectedCourse: {
        ...courseTypeModalProps.selectedCourse,
        skillNames: [...Array(20).keys()].map(i => `skill-${i}`),
      },
    };

    render(
      <IntlProvider locale="en">
        <CatalogInfoModal {...defaultPropsCopy} />
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
  test('Course info modal displays no skills listing if skills not found', () => {
    const defaultPropsCopy = {
      ...courseTypeModalProps,
    };

    render(
      <IntlProvider locale="en">
        <CatalogInfoModal {...defaultPropsCopy} />
      </IntlProvider>,
    );
    expect(screen.queryByText('Related skills')).not.toBeInTheDocument();
  });
});

describe('Program info modal works as expected', () => {
  const programTypeModalProps = {
    ...courseTypeModalProps,
    renderProgram: true,
    selectedCourse: null,
    selectedProgram: {
      programTitle: 'a program',
      programDescription: 'a program desc',
      programProvider: 'edX',
      bannerImageUrl: 'http://image.url',
      programAssociatedCatalogs: [],
      partnerLogoImageUrl: 'http://partner-url',
      marketingUrl: 'http://marketing-url',
      learningItems: ['an item', 'item 2'],
      programPrices: [],
      programCourses: [],
    },
  };
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });
  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });
  test('Program info modal renders when expected', () => {
    render(
      <IntlProvider locale="en">
        <CatalogInfoModal {...programTypeModalProps} />
      </IntlProvider>,
    );

    const { selectedProgram } = programTypeModalProps;
    expect(screen.queryByText(selectedProgram.programTitle)).toBeInTheDocument();
    expect(screen.queryByText(selectedProgram.programProvider)).toBeInTheDocument();
    expect(screen.queryByText(selectedProgram.programDescription)).toBeInTheDocument();
  });
  test('renders learning items section if learningItems if non empty', () => {
    render(
      <IntlProvider locale="en">
        <CatalogInfoModal {...programTypeModalProps} />
      </IntlProvider>,
    );
    expect(screen.queryByText('What you will learn')).toBeInTheDocument();
  });
  test('skipes render of learning items section if learningItems if empty', () => {
    const props = {
      ...programTypeModalProps,
      selectedProgram: { ...programTypeModalProps.selectedProgram, learningItems: [] },
    };
    render(
      <IntlProvider locale="en">
        <CatalogInfoModal {...props} />
      </IntlProvider>,
    );
    expect(screen.queryByText('What you will learn')).not.toBeInTheDocument();
  });
  test('modal displays no courses listing if courses not found', () => {
    render(
      <IntlProvider locale="en">
        <CatalogInfoModal {...programTypeModalProps} />
      </IntlProvider>,
    );

    expect(screen.queryByText('Courses in this program')).not.toBeInTheDocument();
  });
});
