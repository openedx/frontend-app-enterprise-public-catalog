import React, { useEffect } from 'react';
import { Switch } from 'react-router-dom';
import { AppProvider, PageRoute } from '@edx/frontend-platform/react';

import Header from '@edx/frontend-component-header';
import Footer from '@edx/frontend-component-footer';

import useHotjar from 'react-use-hotjar';
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

export default function App() {
  if (process.env.HOTJAR_APP_ID) {
    const { initHotjar } = useHotjar();
    useEffect(() => {
      initHotjar(process.env.HOTJAR_APP_ID, process.env.HOTJAR_VERSION, process.env.HOTJAR_DEBUG);
    }, [initHotjar]);
  }
  return (
    <AppProvider>
      <EnterpriseCatalogsApp />
    </AppProvider>
  );
}
