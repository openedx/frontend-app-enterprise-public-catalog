import React from 'react';
import { Container } from '@edx/paragon';
import { Helmet } from 'react-helmet';

import useCourseCatalogs from './data/hooks';
import { PAGE_TITLE } from '../../constants';

// eslint-disable-next-line react/prop-types
const Wrapper = ({ children }) => (
  <Container size="lg" className="mt-3">
    <Helmet title={PAGE_TITLE} />
    <div className="text-center py-5">
      {children}
    </div>
  </Container>
);

export default function EnterpriseCatalogs() {
  const catalogs = useCourseCatalogs();

  if (!catalogs || catalogs.length < 1) {
    return <Wrapper><div>No Course information found</div></Wrapper>;
  }

  return (
    <Wrapper>
      {
          catalogs.map(catalog => (
            <div>
              {catalog.course} | {catalog.subject} | {catalog.partner}
            </div>
          ))
      }
    </Wrapper>
  );
}
