import React from 'react';
import { Container } from '@edx/paragon';
import { Helmet } from 'react-helmet';

import { PAGE_TITLE } from '../constants';

// eslint-disable-next-line react/prop-types
const Wrapper = ({ children }) => (
  <Container size="lg" className="enterprise-catalogs mt-3">
    <Helmet title={PAGE_TITLE} />
    <div className="py-5">
      {children}
    </div>
  </Container>
);

export default Wrapper;
