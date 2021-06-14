import React from 'react';
import {
  Configure, InstantSearch,
} from 'react-instantsearch-dom';
import { SearchHeader } from '@edx/frontend-enterprise-catalog-search';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import PageWrapper from '../PageWrapper';
import { NUM_RESULTS_PER_PAGE } from '../../constants';
import CatalogSearchResults from './CatalogSearchResults';
import { useAlgoliaIndex, useDefaultSearchFilters } from './data/hooks';

export default function EnterpriseCatalogs() {
  const { algoliaIndexName, searchClient } = useAlgoliaIndex();
  const filters = useDefaultSearchFilters();
  return (
    <>
      <PageWrapper className="enterprise-catalogs">
        <section>
          <FormattedMessage
            id="catalogs.enterpriseCatalogs.header"
            defaultMessage="Search courses and programs"
            description="Search dialogue."
            tagName="h2"
          />
          <InstantSearch
            indexName={algoliaIndexName}
            searchClient={searchClient}
          >
            <Configure hitsPerPage={NUM_RESULTS_PER_PAGE} filters={filters} facetingAfterDistinct />
            <div className="enterprise-catalogs-header"><SearchHeader variant="default" /></div>
            <CatalogSearchResults />
          </InstantSearch>
        </section>
      </PageWrapper>
    </>
  );
}
