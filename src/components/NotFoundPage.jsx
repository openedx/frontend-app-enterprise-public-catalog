import React from 'react';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import PageWrapper from './PageWrapper';

export const NOT_FOUND_TEXT = 'No catalog information is available on this page';

function NotFoundPage() {
  return (
    <PageWrapper>
      <FormattedMessage
        id="notFound.text"
        defaultMessage={NOT_FOUND_TEXT}
        description="Error message returned when no data can be returned."
      />
    </PageWrapper>
  );
}

export default NotFoundPage;
