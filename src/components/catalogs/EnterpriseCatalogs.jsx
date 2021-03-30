import React from 'react';
import {
  Configure, InstantSearch,
} from 'react-instantsearch-dom';
import { SearchData, SearchHeader } from '@edx/frontend-enterprise';

import PageWrapper from '../PageWrapper';
import { NUM_RESULTS_PER_PAGE } from '../../constants';
import CatalogSearchResults from './CatalogSearchResults';
import { useAlgoliaIndex } from './data/hooks';

export default function EnterpriseCatalogs() {
  const { algoliaIndexName, searchClient } = useAlgoliaIndex();

  return (
    <>
      <PageWrapper className="enterprise-catalogs">
        <section>
          <h2>Search courses and programs</h2>
          <SearchData>
            <InstantSearch
              indexName={algoliaIndexName}
              searchClient={searchClient}
            >
              <Configure hitsPerPage={NUM_RESULTS_PER_PAGE} />
              <div className="enterprise-catalogs-header"><SearchHeader variant="default" /></div>
              <CatalogSearchResults />
            </InstantSearch>
          </SearchData>
        </section>
      </PageWrapper>
    </>
  );
}
