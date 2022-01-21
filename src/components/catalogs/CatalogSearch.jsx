/* eslint eqeqeq: "off" */
import React, { useContext } from 'react';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { Configure, Index, InstantSearch } from 'react-instantsearch-dom';
import { SearchHeader, SearchContext } from '@edx/frontend-enterprise-catalog-search';
import { useAlgoliaIndex } from './data/hooks';
import PageWrapper from '../PageWrapper';

import {
  CONTENT_TYPE_COURSE, CONTENT_TYPE_PROGRAM, NUM_RESULTS_COURSE, NUM_RESULTS_PROGRAM, NUM_RESULTS_PER_PAGE,
} from '../../constants';
import CatalogSearchResults from '../catalogSearchResults/CatalogSearchResults';

export default function CatalogSearch() {
  const { refinements: { content_type: contentType, show_programs: programBool } } = useContext(SearchContext);
  const { algoliaIndexName, searchClient } = useAlgoliaIndex();
  const courseFilter = `content_type:${CONTENT_TYPE_COURSE}`;
  const programFilter = `content_type:${CONTENT_TYPE_PROGRAM}`;
  const showProgram = !!((programBool && programBool[0] === 'true'));
  return (
    <>
      <PageWrapper className="mt-3 mb-5 page-width">
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
            <div className="enterprise-catalogs-header"><SearchHeader hideTitle variant="default" /></div>
            {showProgram && (
            <>
              {(!contentType || contentType.length === 2) && (
              <>
                <Index indexName={algoliaIndexName} indexId="search-courses">
                  <Configure
                    hitsPerPage={NUM_RESULTS_COURSE}
                    filters={courseFilter}
                    facetingAfterDistinct
                  />
                  <CatalogSearchResults preview contentType={CONTENT_TYPE_COURSE} />
                </Index>
                <Index indexName={algoliaIndexName} indexId="search-program">
                  <Configure
                    hitsPerPage={NUM_RESULTS_PROGRAM}
                    filters={programFilter}
                    facetingAfterDistinct
                  />
                  <CatalogSearchResults preview contentType={CONTENT_TYPE_PROGRAM} />
                </Index>
              </>
              )}
              {(contentType == CONTENT_TYPE_PROGRAM) && (
              <>
                <Index indexName={algoliaIndexName} indexId="search-program">
                  <Configure
                    hitsPerPage={NUM_RESULTS_PER_PAGE}
                    filters={programFilter}
                    facetingAfterDistinct
                  />
                  <CatalogSearchResults preview={false} contentType={CONTENT_TYPE_PROGRAM} />
                </Index>
              </>
              )}
            </>
            )}
            {(contentType == CONTENT_TYPE_COURSE || !showProgram) && (
            <>
              <Index indexName={algoliaIndexName} indexId="search-courses">
                <Configure
                  hitsPerPage={NUM_RESULTS_PER_PAGE}
                  filters={courseFilter}
                  facetingAfterDistinct
                />
                <CatalogSearchResults preview={false} contentType={CONTENT_TYPE_COURSE} />
              </Index>
            </>
            )}
          </InstantSearch>
        </section>
      </PageWrapper>
    </>
  );
}
