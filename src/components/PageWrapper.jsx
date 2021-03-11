import React from 'react';
import { Container } from '@edx/paragon';
import { Helmet } from 'react-helmet';

import { PAGE_TITLE } from '../constants';

export const DATA_TEST_ID = 'enterprise-catalogs-content';

// eslint-disable-next-line react/prop-types
const Wrapper = ({ children }) => (
  <Container size="lg" className="enterprise-catalogs mt-3">
    <Helmet title={PAGE_TITLE} />
    <div data-testid={DATA_TEST_ID} className="py-5">
      {children}
    </div>
  </Container>
);

export default Wrapper;
