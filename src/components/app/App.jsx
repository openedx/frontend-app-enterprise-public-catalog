import React from 'react';
import { Switch } from 'react-router-dom';
import { AppProvider, PageRoute } from '@edx/frontend-platform/react';

import store from '../../store';
import { EnterpriseCatalogs } from '../catalogs';
import NotFoundPage from '../NotFoundPage';

export default function App() {
  return (
    <AppProvider store={store}>
      <Switch>
        <PageRoute exact path="/" component={EnterpriseCatalogs} />
        <PageRoute path="*" component={NotFoundPage} />
      </Switch>
    </AppProvider>
  );
}
