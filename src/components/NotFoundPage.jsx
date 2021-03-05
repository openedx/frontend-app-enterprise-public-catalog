import React from 'react';
import { Container } from '@edx/paragon';
import { Helmet } from 'react-helmet';

const NotFoundPage = () => (
  <Container size="lg" className="mt-3">
    <Helmet title="edX Enterprise Catalogs" />
    <div className="text-center py-5">
      This content is not available
    </div>
  </Container>
);

export default NotFoundPage;
