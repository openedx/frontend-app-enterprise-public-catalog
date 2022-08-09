/* eslint eqeqeq: "off" */
import React, { useContext, useState, useMemo } from 'react';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { getConfig } from '@edx/frontend-platform/config';
import { Configure, Index, InstantSearch } from 'react-instantsearch-dom';
import { SearchHeader, SearchContext } from '@edx/frontend-enterprise-catalog-search';
import { useAlgoliaIndex } from './data/hooks';
import PageWrapper from '../PageWrapper';

import {
  CONTENT_TYPE_COURSE, CONTENT_TYPE_PROGRAM, NUM_RESULTS_COURSE, NUM_RESULTS_PROGRAM, NUM_RESULTS_PER_PAGE,
} from '../../constants';
import CatalogSearchResults from '../catalogSearchResults/CatalogSearchResults';
import CatalogInfoModal from '../catalogInfoModal/CatalogInfoModal';
import { mapAlgoliaObjectToProgram, mapAlgoliaObjectToCourse } from '../../utils/algoliaUtils';
import messages from '../catalogSearchResults/CatalogSearchResults.messages';

function CatalogSearch(intl) {
  const { refinements: { content_type: contentType } } = useContext(SearchContext);
  const { algoliaIndexName, searchClient } = useAlgoliaIndex();
  const courseFilter = `content_type:${CONTENT_TYPE_COURSE}`;
  const programFilter = `content_type:${CONTENT_TYPE_PROGRAM}`;
  const combinedFilter = `content_type:${CONTENT_TYPE_COURSE} OR content_type:${CONTENT_TYPE_PROGRAM}`;
  const [noCourseResults, setNoCourseResults] = useState(false);
  const [noProgramResults, setNoProgramResults] = useState(false);
  const [selectedSuggestedCourseType, setSelectedSuggestedCourseType] = useState('');
  const [selectedSuggestedCourse, setSelectedSuggestedCourse] = useState({});

  let specifiedContentType;
  if (contentType) {
    if (contentType.length === 1) {
      [specifiedContentType] = contentType;
    }
  }

  let suggestedSearchContentTypeFilter;
  if (!contentType || contentType.length === 2) {
    suggestedSearchContentTypeFilter = combinedFilter;
  } else if (specifiedContentType === CONTENT_TYPE_PROGRAM) {
    suggestedSearchContentTypeFilter = programFilter;
  } else {
    suggestedSearchContentTypeFilter = courseFilter;
  }

  const config = getConfig();
  const courseIndex = useMemo(
    () => {
      const cIndex = searchClient.initIndex(config.ALGOLIA_INDEX_NAME);
      return cIndex;
    },
    [config.ALGOLIA_INDEX_NAME, searchClient],
  );

  const suggestedCourseOnClick = (hit) => {
    if (hit.program_type !== undefined) {
      setSelectedSuggestedCourse(mapAlgoliaObjectToProgram(hit));
      setSelectedSuggestedCourseType('program');
    } else {
      setSelectedSuggestedCourse(mapAlgoliaObjectToCourse(hit, intl, messages));
      setSelectedSuggestedCourseType('course');
    }
  };

  return (
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
          <div className="enterprise-catalogs-header">
            <Configure facetingAfterDistinct />
            <SearchHeader
              hideTitle
              variant="default"
              index={courseIndex}
              filters={suggestedSearchContentTypeFilter}
              disableSuggestionRedirect
              suggestionSubmitOverride={suggestedCourseOnClick}
            />
          </div>
          <CatalogInfoModal
            isOpen={selectedSuggestedCourseType === 'course'}
            onClose={() => setSelectedSuggestedCourse(null)}
            selectedCourse={selectedSuggestedCourse}
          />
          <CatalogInfoModal
            isOpen={selectedSuggestedCourseType === 'program'}
            onClose={() => setSelectedSuggestedCourse(null)}
            selectedProgram={selectedSuggestedCourse}
            renderProgram
          />
          <>
            {(!contentType || contentType.length === 2)
              && (noCourseResults === noProgramResults || !noCourseResults) && (
              <>
                <Index indexName={algoliaIndexName} indexId="search-courses">
                  <Configure
                    hitsPerPage={NUM_RESULTS_COURSE}
                    filters={courseFilter}
                    facetingAfterDistinct
                  />
                  <CatalogSearchResults preview contentType={CONTENT_TYPE_COURSE} setNoCourses={setNoCourseResults} />
                </Index>
                <Index indexName={algoliaIndexName} indexId="search-program">
                  <Configure
                    hitsPerPage={NUM_RESULTS_PROGRAM}
                    filters={programFilter}
                    facetingAfterDistinct
                  />
                  <CatalogSearchResults
                    preview
                    contentType={CONTENT_TYPE_PROGRAM}
                    setNoPrograms={setNoProgramResults}
                  />
                </Index>
              </>
            )}
            {(!contentType || contentType.length === 2) && (noCourseResults && !noProgramResults) && (
            <>
              <Index indexName={algoliaIndexName} indexId="search-program">
                <Configure
                  hitsPerPage={NUM_RESULTS_PROGRAM}
                  filters={programFilter}
                  facetingAfterDistinct
                />
                <CatalogSearchResults
                  preview
                  contentType={CONTENT_TYPE_PROGRAM}
                  setNoPrograms={setNoProgramResults}
                />
              </Index>
              <Index indexName={algoliaIndexName} indexId="search-courses">
                <Configure
                  hitsPerPage={NUM_RESULTS_COURSE}
                  filters={courseFilter}
                  facetingAfterDistinct
                />
                <CatalogSearchResults preview contentType={CONTENT_TYPE_COURSE} setNoCourses={setNoCourseResults} />
              </Index>
            </>
            )}
            {(specifiedContentType === CONTENT_TYPE_PROGRAM) && (
              <Index indexName={algoliaIndexName} indexId="search-program">
                <Configure
                  hitsPerPage={NUM_RESULTS_PER_PAGE}
                  filters={programFilter}
                  facetingAfterDistinct
                />
                <CatalogSearchResults preview={false} contentType={CONTENT_TYPE_PROGRAM} />
              </Index>
            )}
          </>
          {(specifiedContentType === CONTENT_TYPE_COURSE) && (
            <Index indexName={algoliaIndexName} indexId="search-courses">
              <Configure
                hitsPerPage={NUM_RESULTS_PER_PAGE}
                filters={courseFilter}
                facetingAfterDistinct
              />
              <CatalogSearchResults preview={false} contentType={CONTENT_TYPE_COURSE} />
            </Index>
          )}
        </InstantSearch>
      </section>
    </PageWrapper>
  );
}

CatalogSearch.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  intl: intlShape.isRequired,
};

export default injectIntl(CatalogSearch);
