import React, { useEffect } from 'react';
import { Switch } from 'react-router-dom';
import { AppProvider, PageRoute } from '@edx/frontend-platform/react';

import Header from '@edx/frontend-component-header';
import Footer from '@edx/frontend-component-footer';

import { initializeHotjar } from '@edx/frontend-enterprise-hotjar';
import { logError } from '@edx/frontend-platform/logging';
import CatalogPage from '../catalogPage/CatalogPage';
import NotFoundPage from '../NotFoundPage';

export const EnterpriseCatalogsApp = () => (
  <>
    <Header />
    <Switch>
      <PageRoute exact path="/" component={CatalogPage} />
      <PageRoute path="*" component={NotFoundPage} />
    </Switch>
    <Footer />
  </>
);

const App = () => {
  useEffect(() => {
    if (process.env.HOTJAR_APP_ID) {
      try {
        initializeHotjar({
          hotjarId: process.env.HOTJAR_APP_ID,
          hotjarVersion: process.env.HOTJAR_VERSION,
          hotjarDebug: !!process.env.HOTJAR_DEBUG,
        });
      } catch (error) {
        logError(error);
      }
    }
  }, []);

  return (
    <AppProvider>
      <EnterpriseCatalogsApp />
    </AppProvider>
  );
};

export default App;
