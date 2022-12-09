/* eslint eqeqeq: "off" */
import React, {
  useContext, useState, useMemo, useEffect,
} from 'react';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';

import { getConfig } from '@edx/frontend-platform/config';
import { Configure, Index, InstantSearch } from 'react-instantsearch-dom';
import {
  SearchHeader,
  SearchContext,
} from '@edx/frontend-enterprise-catalog-search';
import { useAlgoliaIndex } from './data/hooks';
import PageWrapper from '../PageWrapper';

import {
  CONTENT_TYPE_COURSE,
  CONTENT_TYPE_PROGRAM,
  EXECUTIVE_EDUCATION_2U_COURSE_TYPE,
  NUM_RESULTS_COURSE,
  NUM_RESULTS_PROGRAM,
  NUM_RESULTS_PER_PAGE,
} from '../../constants';
import features from '../../config';
import CatalogSearchResults from '../catalogSearchResults/CatalogSearchResults';
import CatalogInfoModal from '../catalogInfoModal/CatalogInfoModal';
import {
  mapAlgoliaObjectToProgram,
  mapAlgoliaObjectToCourse,
  mapAlgoliaObjectToExecEd,
} from '../../utils/algoliaUtils';
import messages from '../catalogSearchResults/CatalogSearchResults.messages';

function CatalogSearch(intl) {
  const {
    refinements: {
      learning_type: learningType,
      enterprise_catalog_query_titles: enterpriseCatalogQueryTitles,
    },
  } = useContext(SearchContext);
  const { algoliaIndexName, searchClient } = useAlgoliaIndex();
  const courseFilter = `learning_type:${CONTENT_TYPE_COURSE}`;
  const execEdFilter = `learning_type:${EXECUTIVE_EDUCATION_2U_COURSE_TYPE}`;
  const programFilter = `learning_type:${CONTENT_TYPE_PROGRAM}`;
  const [noCourseResults, setNoCourseResults] = useState(false);
  const [noProgramResults, setNoProgramResults] = useState(false);
  const [noExecEdResults, setNoExecEdResults] = useState(false);
  const [selectedSuggestedCourseType, setSelectedSuggestedCourseType] = useState('');
  const [selectedSuggestedCourse, setSelectedSuggestedCourse] = useState({});
  const [specifiedContentType, setSpecifiedContentType] = useState();
  const [
    suggestedSearchContentTypeFilter,
    setSuggestedSearchContentTypeFilter,
  ] = useState('');

  const [contentWithResults, setContentWithResults] = useState([]);
  const [contentWithoutResults, setContentWithoutResults] = useState([]);

  const contentData = useMemo(
    () => ({
      [CONTENT_TYPE_COURSE]: {
        filter: courseFilter,
        noResults: noCourseResults,
        setNoResults: setNoCourseResults,
        numResults: NUM_RESULTS_COURSE,
      },
      [EXECUTIVE_EDUCATION_2U_COURSE_TYPE]: {
        filter: execEdFilter,
        noResults: noExecEdResults,
        setNoResults: setNoExecEdResults,
        numResults: NUM_RESULTS_COURSE,
      },
      [CONTENT_TYPE_PROGRAM]: {
        filter: programFilter,
        noResults: noProgramResults,
        setNoResults: setNoProgramResults,
        numResults: NUM_RESULTS_PROGRAM,
      },
    }),
    [
      courseFilter,
      execEdFilter,
      programFilter,
      noCourseResults,
      noExecEdResults,
      noProgramResults,
    ],
  );

  useEffect(() => {
    contentData[CONTENT_TYPE_COURSE].noResults = noCourseResults;
    contentData[CONTENT_TYPE_PROGRAM].noResults = noProgramResults;
    contentData[EXECUTIVE_EDUCATION_2U_COURSE_TYPE].noResults = noExecEdResults;
  }, [noCourseResults, noProgramResults, noExecEdResults, contentData]);

  // set specified content types & suggested search content types
  useEffect(() => {
    if (learningType) {
      if (learningType.length === 1) {
        setSpecifiedContentType(learningType);
      }
      setSuggestedSearchContentTypeFilter(
        learningType.map((item) => `learning_type:${item}`).join(' OR '),
      );
    } else {
      setSpecifiedContentType(undefined);
      setSuggestedSearchContentTypeFilter(
        [
          CONTENT_TYPE_COURSE,
          CONTENT_TYPE_PROGRAM,
          EXECUTIVE_EDUCATION_2U_COURSE_TYPE,
        ]
          .map((item) => `learning_type:${item}`)
          .join(' OR '),
      );
    }
  }, [learningType, setSpecifiedContentType]);

  const config = getConfig();
  const courseIndex = useMemo(() => {
    const cIndex = searchClient.initIndex(config.ALGOLIA_INDEX_NAME);
    return cIndex;
  }, [config.ALGOLIA_INDEX_NAME, searchClient]);

  const suggestedCourseOnClick = (hit) => {
    if (hit.learning_type === CONTENT_TYPE_PROGRAM) {
      setSelectedSuggestedCourse(mapAlgoliaObjectToProgram(hit));
      setSelectedSuggestedCourseType(CONTENT_TYPE_PROGRAM);
    } else if (hit.learning_type === EXECUTIVE_EDUCATION_2U_COURSE_TYPE) {
      setSelectedSuggestedCourse(mapAlgoliaObjectToExecEd(hit));
      setSelectedSuggestedCourseType(EXECUTIVE_EDUCATION_2U_COURSE_TYPE);
    } else {
      setSelectedSuggestedCourse(mapAlgoliaObjectToCourse(hit, intl, messages));
      setSelectedSuggestedCourseType(CONTENT_TYPE_COURSE);
    }
  };

  // Build out the list of content to display, ordering first by learning types that currently have results
  // and then by `course` > `exec ed` > `program`. Make sure to remove exec ed if the feature flag is disabled
  // or if the currently selected catalog isn't `a la carte`.
  useEffect(() => {
    const defaultTypes = [
      CONTENT_TYPE_COURSE,
      EXECUTIVE_EDUCATION_2U_COURSE_TYPE,
      CONTENT_TYPE_PROGRAM,
    ];
    // Grab content type(s) to use
    const contentToDisplay = learningType
      ? defaultTypes.filter((value) => learningType.includes(value))
      : defaultTypes;

    // Determine if we need to remove exec ed
    if (
      (enterpriseCatalogQueryTitles
        && !enterpriseCatalogQueryTitles.includes(
          config.EDX_ENTERPRISE_ALACARTE_TITLE,
        ))
      || !features.EXEC_ED_INCLUSION
    ) {
      if (contentToDisplay.indexOf(EXECUTIVE_EDUCATION_2U_COURSE_TYPE) > 0) {
        contentToDisplay.splice(
          contentToDisplay.indexOf(EXECUTIVE_EDUCATION_2U_COURSE_TYPE),
          1,
        );
      }
    }

    // rendering in order of what content we have search results for
    const resultList = contentToDisplay.filter(
      (obj) => !contentData[obj].noResults,
    );
    setContentWithResults(resultList);

    const noResultList = contentToDisplay.filter(
      (obj) => contentData[obj].noResults,
    );
    setContentWithoutResults(noResultList);
  }, [
    enterpriseCatalogQueryTitles,
    config,
    specifiedContentType,
    learningType,
    contentData,
    noCourseResults,
    noProgramResults,
    noExecEdResults,
  ]);

  // Take a list of learning types and render a search results component for each item
  const contentToRender = (items) => {
    const itemsWithResultsList = items.map((item) => (
      <Index
        indexName={algoliaIndexName}
        indexId={`search-${item}`}
        key={`search-${item}`}
      >
        <Configure
          hitsPerPage={
            specifiedContentType && learningType?.length === 1
              ? NUM_RESULTS_PER_PAGE
              : contentData[item].numResults
          }
          filters={contentData[item].filter}
          facetingAfterDistinct
        />
        <CatalogSearchResults
          preview={specifiedContentType === undefined}
          contentType={item}
          setNoContent={contentData[item].setNoResults}
        />
      </Index>
    ));
    return itemsWithResultsList;
  };

  const defaultInstantSearchFilter = `learning_type:${CONTENT_TYPE_COURSE} OR learning_type:${CONTENT_TYPE_PROGRAM}${
    features.EXEC_ED_INCLUSION
      ? ` OR learning_type:${EXECUTIVE_EDUCATION_2U_COURSE_TYPE}`
      : ''
  }`;

  return (
    <PageWrapper className="mt-3 mb-5 page-width">
      <section>
        <FormattedMessage
          id="catalogs.enterpriseCatalogs.header"
          defaultMessage="Search courses and programs"
          description="Search dialogue."
          tagName="h2"
        />
        <InstantSearch indexName={algoliaIndexName} searchClient={searchClient}>
          <div className="enterprise-catalogs-header">
            <Configure
              filters={defaultInstantSearchFilter}
              facetingAfterDistinct
            />
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
            {contentToRender([...contentWithResults, ...contentWithoutResults])}
          </>
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
