import React from 'react';
import PageWrapper from './PageWrapper';

export const NOT_FOUND_TEXT = 'No catalog information is available on this page';
const NotFoundPage = () => (
  <PageWrapper> {NOT_FOUND_TEXT} </PageWrapper>

);

export default NotFoundPage;
