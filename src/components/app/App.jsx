import React from 'react';
import { Switch } from 'react-router-dom';
import { AppProvider, PageRoute } from '@edx/frontend-platform/react';

import Header from '@edx/frontend-component-header';
import Footer from '@edx/frontend-component-footer';

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
  return (
    <AppProvider>
      <EnterpriseCatalogsApp />
    </AppProvider>
  );
}
