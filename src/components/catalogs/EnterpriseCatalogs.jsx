import React from 'react';
import {
  Configure, InstantSearch,
} from 'react-instantsearch-dom';

import { SearchData, SearchHeader } from '@edx/frontend-enterprise';

import PageWrapper from '../PageWrapper';
import { NUM_RESULTS_PER_PAGE } from '../../constants';
import CatalogSearchResults from './CatalogSearchResults';
import { useAlgoliaIndex } from './data/hooks';
import Hero from '../hero/Hero';
import CallToAction from '../callToAction/callToAction';

const ctaText= 'Explore comprehensive course catalogs curated for businesses and for educational institutions, or work with an edX representative to customize a solution for your unique needs.'


export default function EnterpriseCatalogs() {
  const { algoliaIndexName, searchClient } = useAlgoliaIndex();

  return (
    <>
      <Hero
        text="Browse edX courses"
      />
      <CallToAction
        title="Tailored learning for your team"
        text={ctaText}
      />
      <PageWrapper>
        <SearchData>
          <InstantSearch
            indexName={algoliaIndexName}
            searchClient={searchClient}
          >
            <Configure hitsPerPage={NUM_RESULTS_PER_PAGE} />
            <div className="enterprise-catalogs-header"><SearchHeader /></div>
            <CatalogSearchResults />
          </InstantSearch>
        </SearchData>
      </PageWrapper>
    </>
  );
}
