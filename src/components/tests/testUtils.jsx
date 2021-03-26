/* eslint-disable import/prefer-default-export */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { AppContext } from '@edx/frontend-platform/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { messages as headerMessages } from '@edx/frontend-component-header';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const TEST_CONFIG = {
  ALGOLIA_APP_ID: 'app',
  ALGOLIA_INDEX_NAME: 'index',
  ALGOLIA_SEARCH_API_KEY: 'key',
};

export const renderWithRouter = (ui, { route } = {}) => {
  const history = createMemoryHistory();
  if (route) { history.push(route); }
  const locale = 'en';
  render(
    <AppContext.Provider value={{ authenticatedUser: null, config: TEST_CONFIG, locale }}>
      <IntlProvider locale={locale} messages={headerMessages[locale]}>
        <Router history={history}>
          {ui}
        </Router>
      </IntlProvider>
    </AppContext.Provider>,
  );
};
