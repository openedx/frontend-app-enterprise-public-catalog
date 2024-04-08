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
import { Image } from '@edx/paragon';
import { useAlgoliaIndex } from './data/hooks';
import PageWrapper from '../PageWrapper';

import {
  CONTENT_TYPE_COURSE,
  CONTENT_TYPE_PROGRAM,
  EXEC_ED_TITLE,
  LEARNING_TYPE_REFINEMENT,
  NUM_RESULTS_COURSE,
  NUM_RESULTS_PROGRAM,
  NUM_RESULTS_PER_PAGE,
} from '../../constants';
import CatalogSearchResults from '../catalogSearchResults/CatalogSearchResults';
import CatalogInfoModal from '../catalogInfoModal/CatalogInfoModal';
import {
  mapAlgoliaObjectToProgram,
  mapAlgoliaObjectToCourse,
  mapAlgoliaObjectToExecEd,
} from '../../utils/algoliaUtils';
import { convertLearningTypesToFilters } from '../../utils/catalogUtils';
import messages from '../catalogSearchResults/CatalogSearchResults.messages';
import xpertLogo from '../../assets/edx-xpert-logo.png';
import features from '../../config';
import AskXpert from '../aiCuration/AskXpert';

const CatalogSearch = (intl) => {
  const {
    refinements: {
      [LEARNING_TYPE_REFINEMENT]: learningType,
      enterprise_catalog_query_titles: enterpriseCatalogQueryTitles,
    },
  } = useContext(SearchContext);
  const { algoliaIndexName, searchClient } = useAlgoliaIndex();
  const courseFilter = `${LEARNING_TYPE_REFINEMENT}:${CONTENT_TYPE_COURSE}`;
  const execEdFilter = `${LEARNING_TYPE_REFINEMENT}:"${EXEC_ED_TITLE}"`;
  const programFilter = `${LEARNING_TYPE_REFINEMENT}:${CONTENT_TYPE_PROGRAM}`;
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
  const [showAskXpert, setShowAskXpert] = useState(false);
  const [xpertData, setXpertData] = useState({});

  const contentData = useMemo(
    () => ({
      [CONTENT_TYPE_COURSE]: {
        filter: courseFilter,
        noResults: noCourseResults,
        setNoResults: setNoCourseResults,
        numResults: NUM_RESULTS_COURSE,
      },
      [EXEC_ED_TITLE]: {
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
    contentData[EXEC_ED_TITLE].noResults = noExecEdResults;
  }, [noCourseResults, noProgramResults, noExecEdResults, contentData]);

  // set specified content types & suggested search content types
  useEffect(() => {
    if (learningType) {
      if (learningType.length === 1) {
        setSpecifiedContentType(learningType);
      }
      setSuggestedSearchContentTypeFilter(
        convertLearningTypesToFilters(learningType),
      );
    } else {
      setSpecifiedContentType(undefined);
      setSuggestedSearchContentTypeFilter(
        [
          CONTENT_TYPE_COURSE,
          CONTENT_TYPE_PROGRAM,
          `"${EXEC_ED_TITLE}"`,
        ]
          .map((item) => `${LEARNING_TYPE_REFINEMENT}:${item}`)
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
    if (hit[LEARNING_TYPE_REFINEMENT] === CONTENT_TYPE_PROGRAM) {
      setSelectedSuggestedCourse(mapAlgoliaObjectToProgram(hit));
      setSelectedSuggestedCourseType(CONTENT_TYPE_PROGRAM);
    } else if (hit[LEARNING_TYPE_REFINEMENT] === EXEC_ED_TITLE) {
      setSelectedSuggestedCourse(mapAlgoliaObjectToExecEd(hit));
      setSelectedSuggestedCourseType(EXEC_ED_TITLE);
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
      EXEC_ED_TITLE,
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
    ) {
      if (contentToDisplay.indexOf(EXEC_ED_TITLE) > 0) {
        contentToDisplay.splice(
          contentToDisplay.indexOf(EXEC_ED_TITLE),
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
    const itemsWithResultsList = items.map((item) => {
      let filters = contentData[item].filter;

      if (features.ENABLE_AI_CURATION) {
        if (xpertData[item]?.length > 0) {
          filters += ` AND (${xpertData[item]?.map(key => `aggregation_key:'${key}'`).join(' OR ')})`;
        } else if (xpertData[item]?.length === 0) {
          filters = 'aggregation_key: null';
        }
      }

      return (
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
            filters={filters}
            facetingAfterDistinct
          />
          <CatalogSearchResults
            preview={specifiedContentType === undefined}
            contentType={item}
            setNoContent={contentData[item].setNoResults}
          />
        </Index>
      );
    });
    return itemsWithResultsList;
  };

  const defaultInstantSearchFilter = `${LEARNING_TYPE_REFINEMENT}:${CONTENT_TYPE_COURSE} OR ${LEARNING_TYPE_REFINEMENT}:${CONTENT_TYPE_PROGRAM} OR ${LEARNING_TYPE_REFINEMENT}:"${EXEC_ED_TITLE}"`;

  return (
    <PageWrapper className="mt-3 mb-5" size="xl">
      <section>
        <div className="d-flex align-items-center">
          <FormattedMessage
            id="catalogs.enterpriseCatalogs.header"
            defaultMessage="Search our catalog"
            description="Search dialogue."
            tagName="h2"
          />
          { features.ENABLE_AI_CURATION && !showAskXpert && (
            <Image
              className="ml-2 xpert-logo"
              src={xpertLogo}
              rounded
              alt="xpert logo"
              onClick={() => setShowAskXpert(true)}
            />
          )}
        </div>
        <InstantSearch indexName={algoliaIndexName} searchClient={searchClient}>
          <div className="enterprise-catalogs-header">
            <Configure
              filters={defaultInstantSearchFilter}
              facetingAfterDistinct
            />
            { !showAskXpert && (
            <SearchHeader
              hideTitle
              variant="default"
              index={courseIndex}
              filters={suggestedSearchContentTypeFilter}
              disableSuggestionRedirect
              suggestionSubmitOverride={suggestedCourseOnClick}
            />
            ) }
            {
              showAskXpert && (
              <AskXpert
                catalogName={enterpriseCatalogQueryTitles[0]}
                onClose={() => {
                  setShowAskXpert(false);
                  setXpertData({});
                }}
                onXpertData={(data) => setXpertData(data)}
              />
              )
            }
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
};

CatalogSearch.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  intl: intlShape.isRequired,
};

export default injectIntl(CatalogSearch);
