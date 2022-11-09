import React from 'react';
import { Container } from '@edx/paragon';
import { Helmet } from 'react-helmet';

import { PAGE_TITLE } from '../constants';

export const DATA_TEST_ID = 'enterprise-catalogs-content';

// eslint-disable-next-line react/prop-types
function PageWrapper({ children, className }) {
  return (
    <Container className={className}>
      <Helmet title={PAGE_TITLE} />
      <div data-testid={DATA_TEST_ID}>{children}</div>
    </Container>
  );
}

PageWrapper.defaultProps = {
  className: '',
};

export default PageWrapper;
