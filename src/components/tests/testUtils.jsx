/* eslint-disable import/prefer-default-export */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { AppContext } from '@edx/frontend-platform/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { messages as headerMessages } from '@edx/frontend-component-header';
import { MemoryRouter as Router } from 'react-router-dom';

const TEST_CONFIG = {

  ALGOLIA_APP_ID: 'app',
  ALGOLIA_INDEX_NAME: 'index',
  ALGOLIA_SEARCH_API_KEY: 'key',
};

export const renderWithRouter = (ui, { route } = { route: '/' }) => {
  const locale = 'en';
  return render(
    <AppContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{ authenticatedUser: null, config: TEST_CONFIG, locale }}
    >
      <IntlProvider locale={locale} messages={headerMessages[locale]}>
        <Router initialEntries={[route]}>{ui}</Router>
      </IntlProvider>
    </AppContext.Provider>,
  );
};

export function mockWindowLocations() {
  const mockResponse = jest.fn();
  Object.defineProperty(window, 'location', {
    value: {
      hash: {
        endsWith: mockResponse,
        includes: mockResponse,
      },
      assign: mockResponse,
    },
    writable: true,
  });
}
