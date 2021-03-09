import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  Configure, InstantSearch,
} from 'react-instantsearch-dom';

import { getConfig } from '@edx/frontend-platform';
import { SearchData, SearchHeader } from '@edx/frontend-enterprise';

import Wrapper from '../PageWrapper';
import { NUM_RESULTS_PER_PAGE } from '../../constants';
import CatalogSearchResults from './CatalogSearchResults';

export default function EnterpriseCatalogs() {
  const config = getConfig();
  const searchClient = algoliasearch(
    config.ALGOLIA_APP_ID,
    config.ALGOLIA_SEARCH_API_KEY,
  );

  return (
    <Wrapper>
      <SearchData>
        <InstantSearch
          indexName={config.ALGOLIA_INDEX_NAME}
          searchClient={searchClient}
        >
          <Configure hitsPerPage={NUM_RESULTS_PER_PAGE} />
          <div className="search-header-wrapper">
            <SearchHeader />
          </div>
          <CatalogSearchResults />
        </InstantSearch>
      </SearchData>
    </Wrapper>
  );
}
