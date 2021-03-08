import React from 'react';
import { Switch } from 'react-router-dom';
import { AppProvider, PageRoute } from '@edx/frontend-platform/react';

import Header from '@edx/frontend-component-header';
import Footer from '@edx/frontend-component-footer';

import { EnterpriseCatalogs } from '../catalogs';
import NotFoundPage from '../NotFoundPage';

export default function App() {
  return (
    <AppProvider>
      <Header />
      <Switch>
        <PageRoute exact path="/" component={EnterpriseCatalogs} />
        <PageRoute path="*" component={NotFoundPage} />
      </Switch>
      <Footer />
    </AppProvider>
  );
}
