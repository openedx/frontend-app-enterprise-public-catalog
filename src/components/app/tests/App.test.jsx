/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom/extend-expect';

import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { AppContext } from '@edx/frontend-platform/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { EnterpriseCatalogsApp } from '../App';
import { NOT_FOUND_TEXT } from '../../NotFoundPage';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendPageEvent: jest.fn(),
}));

jest.mock('@edx/frontend-platform/auth');
getAuthenticatedUser.mockReturnValue({ username: 'test-username' });

/**
 * Rationale of test: Render the main EnterpriseCatalogsApp excluding the AppProvider (which is
 * what App does)
 * This allows us to inject fake data into AppProvider
 */

const TEST_CONFIG = {
  ALGOLIA_APP_ID: 'app',
  ALGOLIA_INDEX_NAME: 'index',
  ALGOLIA_SEARCH_API_KEY: 'key',
};
const renderWithRouter = (ui, { route } = {}) => {
  const history = createMemoryHistory();
  if (route) { history.push(route); }
  const locale = 'en-US';
  render(
    <AppContext.Provider value={{ authenticatedUser: null, config: TEST_CONFIG, locale }}>
      <IntlProvider locale={locale} messages={{}}>
        <Router history={history}>
          {ui}
        </Router>
      </IntlProvider>
    </AppContext.Provider>,
  );
};

describe('app routes', () => {
  test('/ renders the EnterpriseCatalogs component', () => {
    renderWithRouter(<EnterpriseCatalogsApp />);
    // we are good if the table renders
    expect(screen.getByTestId('enterprise-catalogs-content')).toBeInTheDocument();
  });
  test('all other routes render the NotFoundPage component', () => {
    renderWithRouter(<EnterpriseCatalogsApp />, { route: '/something-else' });
    // ensure the not found page renders instead
    expect(screen.getByText(NOT_FOUND_TEXT)).toBeInTheDocument();
  });
});
