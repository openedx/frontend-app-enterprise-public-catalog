import {
  SearchContext,
  SearchPagination,
  setRefinementAction,
  useNbHitsFromSearchResults,
} from '@edx/frontend-enterprise-catalog-search';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import {
  Alert, Badge, Button, CardView, DataTable,
} from '@edx/paragon';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { connectStateResults } from 'react-instantsearch-dom';
import Skeleton from 'react-loading-skeleton';
import {
  CONTENT_TYPE_COURSE,
  CONTENT_TYPE_PROGRAM,
  COURSE_TITLE,
  EDX_COURSE_TITLE_DESC,
  EXEC_ED_TITLE,
  HIDE_PRICE_REFINEMENT,
  LEARNING_TYPE_REFINEMENT,
  PROGRAM_TITLE,
  PROGRAM_TITLE_DESC,
  TWOU_EXEC_ED_TITLE_DESC,
} from '../../constants';
import {
  mapAlgoliaObjectToCourse,
  mapAlgoliaObjectToExecEd,
  mapAlgoliaObjectToProgram,
} from '../../utils/algoliaUtils';
import CatalogInfoModal from '../catalogInfoModal/CatalogInfoModal';
import { useSelectedCourse } from '../catalogs/data/hooks';
import CourseCard from '../courseCard/CourseCard';
import ProgramCard from '../programCard/ProgramCard';
import CatalogBadges from './associatedComponents/catalogBadges/CatalogBadges';
import TitleButton from './associatedComponents/titleButton/TitleButton';
import DownloadCsvButton from './associatedComponents/downloadCsvButton/DownloadCsvButton';
import messages from './CatalogSearchResults.messages';

import CatalogNoResultsDeck from '../catalogNoResultsDeck/CatalogNoResultsDeck';
import { formatDate, makePlural } from '../../utils/common';

export const ERROR_MESSAGE = 'An error occured while retrieving data';

export const SKELETON_DATA_TESTID = 'enterprise-catalog-skeleton';

/**
 * The core search results rendering component.
 *
 * Wrapping this in `connectStateResults()` will inject the first few props.
 *
 * @param {object} args arguments
 * @param {object} args.searchResults Results of search (see: `connectStateResults``)
 * @param {Boolean} args.isSearchStalled Whether search is stalled (see: `connectStateResults`)
 * @param {object} args.searchState contents of search state, like `page` (see: `connectStateResults``)
 * @param {object} args.error Error with `message` field if available (see: `connectStateResults``)
 * @param {object} args.paginationComponent Defaults to <SearchPagination> but can be injected
 * @param {object} args.contentType Whether the search is for courses or programs
 * @param {object} args.preview Whether we are on the split screen landing page or regular
 */

export const BaseCatalogSearchResults = ({
  intl,
  searchResults,
  // algolia recommends this prop instead of searching
  isSearchStalled,
  searchState,
  error,
  paginationComponent: PaginationComponent,
  contentType,
  setNoContent,
  preview,
}) => {
  const [isProgramType, setIsProgramType] = useState();
  const [isCourseType, setIsCourseType] = useState();
  const [isExecEdType, setIsExecEdType] = useState();

  useEffect(() => {
    setIsProgramType(contentType === CONTENT_TYPE_PROGRAM);
    setIsCourseType(contentType === CONTENT_TYPE_COURSE);
    setIsExecEdType(contentType === EXEC_ED_TITLE);
  }, [contentType]);

  const TABLE_HEADERS = useMemo(
    () => ({
      courseName: intl.formatMessage(
        messages['catalogSearchResults.table.courseName'],
      ),
      partner: intl.formatMessage(
        messages['catalogSearchResults.table.partner'],
      ),
      price: intl.formatMessage(messages['catalogSearchResults.table.price']),
      availability: intl.formatMessage(
        messages['catalogSearchResults.table.availability'],
      ),
      catalogs: intl.formatMessage(
        messages['catalogSearchResults.table.catalogs'],
      ),
      programName: intl.formatMessage(
        messages['catalogSearchResults.table.programName'],
      ),
      numCourses: intl.formatMessage(
        messages['catalogSearchResults.table.numCourses'],
      ),
      programType: intl.formatMessage(
        messages['catalogSearchResults.table.programType'],
      ),
    }),
    [intl],
  );

  const { refinements, dispatch } = useContext(SearchContext);
  const nbHits = useNbHitsFromSearchResults(searchResults);
  const linkText = `See all (${nbHits}) >`;

  const [selectedCourse, setSelectedCourse, isProgram, isCourse] = useSelectedCourse();

  const [cardView, setCardView] = useState(true);

  const rowClicked = useCallback(
    (row) => {
      if (isProgramType) {
        setSelectedCourse(mapAlgoliaObjectToProgram(row.original));
      } else if (isExecEdType) {
        setSelectedCourse(
          mapAlgoliaObjectToExecEd(row.original, intl, messages),
        );
      } else {
        setSelectedCourse(
          mapAlgoliaObjectToCourse(row.original, intl, messages),
        );
      }
    },
    [intl, isProgramType, setSelectedCourse, isExecEdType],
  );

  const cardClicked = useCallback(
    (card) => {
      if (isProgramType) {
        setSelectedCourse(mapAlgoliaObjectToProgram(card));
      } else if (isExecEdType) {
        setSelectedCourse(mapAlgoliaObjectToExecEd(card, intl, messages));
      } else {
        setSelectedCourse(mapAlgoliaObjectToCourse(card, intl, messages));
      }
    },
    [intl, isProgramType, setSelectedCourse, isExecEdType],
  );

  const refinementClick = () => {
    if (isCourseType) {
      dispatch(
        setRefinementAction(LEARNING_TYPE_REFINEMENT, [CONTENT_TYPE_COURSE]),
      );
    } else if (isExecEdType) {
      dispatch(
        setRefinementAction(LEARNING_TYPE_REFINEMENT, [
          EXEC_ED_TITLE,
        ]),
      );
    } else {
      dispatch(
        setRefinementAction(LEARNING_TYPE_REFINEMENT, [CONTENT_TYPE_PROGRAM]),
      );
    }
  };

  const renderCardComponent = (props) => {
    if (contentType === CONTENT_TYPE_COURSE) {
      return <CourseCard {...props} learningType={contentType} onClick={cardClicked} />;
    }
    if (contentType === EXEC_ED_TITLE) {
      return <CourseCard {...props} learningType={contentType} onClick={cardClicked} />;
    }
    return <ProgramCard {...props} onClick={cardClicked} />;
  };

  const availabilityColumn = {
    id: 'availability-column',
    Header: TABLE_HEADERS.availability,
    accessor: 'advertised_course_run',
    Cell: ({ row }) => formatDate(row.values.advertised_course_run),
  };

  const TitleButtonComponent = useCallback(
    ({ row }) => <TitleButton row={row} onClick={rowClicked} />,
    [rowClicked],
  );

  const CatalogBadgeComponent = useCallback(
    ({ row }) => <CatalogBadges row={row} />,
    [],
  );

  // NOTE: Cell is not explicity supported in DataTable, which leads to lint errors regarding {row}. However, we needed
  // to use the accessor functionality instead of just adding in additionalColumns like the Paragon documentation.
  const courseColumns = useMemo(
    () => [
      {
        Header: TABLE_HEADERS.courseName,
        accessor: 'title',
        Cell: TitleButtonComponent,
      },
      {
        Header: TABLE_HEADERS.partner,
        accessor: 'partners[0].name',
      },
      {
        Header: TABLE_HEADERS.price,
        accessor: 'first_enrollable_paid_seat_price',
        Cell: ({ row }) => (row.values.first_enrollable_paid_seat_price
          ? `$${row.values.first_enrollable_paid_seat_price}`
          : null),
      },
      {
        Header: TABLE_HEADERS.catalogs,
        accessor: 'enterprise_catalog_query_titles',
        Cell: CatalogBadgeComponent,
      },
    ],
    [TABLE_HEADERS, TitleButtonComponent, CatalogBadgeComponent],
  );

  const execEdColumns = useMemo(
    () => [
      {
        Header: TABLE_HEADERS.courseName,
        accessor: 'title',
        Cell: TitleButtonComponent,
      },
      {
        Header: TABLE_HEADERS.partner,
        accessor: 'partners[0].name',
      },
      {
        Header: TABLE_HEADERS.price,
        accessor: 'entitlements',
        Cell: ({ row }) => (row.values.entitlements[0].price
          ? `$${Math.trunc(row.values.entitlements[0].price)}`
          : null),
      },
      {
        Header: TABLE_HEADERS.catalogs,
        accessor: 'enterprise_catalog_query_titles',
        Cell: CatalogBadgeComponent,
      },
    ],
    [TABLE_HEADERS, TitleButtonComponent, CatalogBadgeComponent],
  );

  const programColumns = useMemo(
    () => [
      {
        Header: TABLE_HEADERS.programName,
        accessor: 'title',
        Cell: TitleButtonComponent,
      },
      {
        Header: TABLE_HEADERS.partner,
        accessor: 'authoring_organizations[0].name',
      },
      {
        Header: TABLE_HEADERS.numCourses,
        accessor: 'course_keys',
        Cell: ({ row }) => (row.values.course_keys.length > 0
          ? `${row.values.course_keys.length}`
          : 'Available upon request'),
      },
      {
        Header: TABLE_HEADERS.programType,
        accessor: 'program_type',
      },

      {
        Header: TABLE_HEADERS.catalogs,
        accessor: 'enterprise_catalog_query_titles',
        Cell: CatalogBadgeComponent,
      },
    ],
    [TABLE_HEADERS, TitleButtonComponent, CatalogBadgeComponent],
  );

  const [chosenColumn, setChosenColumns] = useState(courseColumns);

  // Select which columns to use depending on the current content type
  useEffect(() => {
    if (isCourseType) {
      setChosenColumns(courseColumns);
    } else if (isProgramType) {
      setChosenColumns(programColumns);
    } else {
      setChosenColumns(execEdColumns);
    }
  }, [
    setChosenColumns,
    courseColumns,
    programColumns,
    execEdColumns,
    isCourseType,
    isProgramType,
    chosenColumn,
  ]);

  // substituting the price column with the availability dates per customer request ENT-5041
  const page = refinements.page || (searchState ? searchState.page : 0);
  if (HIDE_PRICE_REFINEMENT in refinements) {
    courseColumns[2] = availabilityColumn;
  }
  const tableData = useMemo(
    () => searchResults?.hits || [],
    [searchResults?.hits],
  );
  const query = new URLSearchParams(window.location.search.substring(1));
  const toggleOptions = preview
    ? {}
    : {
      isDataViewToggleEnabled: true,
      onDataViewToggle: (val) => setCardView(val === 'card'),
      togglePlacement: 'left',
      defaultActiveStateValue: 'card',
    };

  function contentTitle() {
    let subTitle;
    if (isExecEdType) {
      subTitle = EXEC_ED_TITLE;
    } else if (isCourseType) {
      subTitle = COURSE_TITLE;
    } else {
      subTitle = PROGRAM_TITLE;
    }
    if (refinements.q && refinements.q !== '') {
      subTitle = `"${refinements.q}" ${subTitle} (${makePlural(
        nbHits,
        'result',
      )})`;
    }
    return subTitle;
  }

  function contentTitleDescription() {
    let desc;
    if (isExecEdType) {
      desc = TWOU_EXEC_ED_TITLE_DESC;
    } else if (isCourseType) {
      desc = EDX_COURSE_TITLE_DESC;
    } else {
      desc = PROGRAM_TITLE_DESC;
    }
    return desc;
  }

  useEffect(() => {
    setNoContent(searchResults === null || searchResults?.nbHits === 0);
  }, [searchResults, setNoContent]);

  const inputQuery = query.q;

  const dataTableActions = () => {
    if (preview || searchResults?.nbHits === 0) {
      return null;
    }

    return (
      <DownloadCsvButton
        // eslint-disable-next-line no-underscore-dangle
        facets={searchResults?._state.disjunctiveFacetsRefinements}
        query={inputQuery}
      />
    );
  };

  if (isSearchStalled) {
    return (
      <div data-testid={SKELETON_DATA_TESTID}>
        <Skeleton className="m-1 loading-skeleton" height={25} count={5} />
      </div>
    );
  }
  if (error) {
    return (
      <Alert className="mt-2" variant="warning">
        <FormattedMessage
          id="catalogs.catalogSearchResults.error"
          defaultMessage="{message}: {fullError}"
          description="Error message displayed when results cannot be returned."
          values={{ message: ERROR_MESSAGE, fullError: error.message }}
        />
      </Alert>
    );
  }

  const CustomRowStatus = () => null;

  return (
    <>
      {(isCourseType || isExecEdType) && (
        <CatalogInfoModal
          isOpen={isCourse}
          onClose={() => setSelectedCourse(null)}
          selectedCourse={selectedCourse}
          isExecEdType={isExecEdType}
        />
      )}
      {isProgramType && (
        <CatalogInfoModal
          isOpen={isProgram}
          onClose={() => setSelectedCourse(null)}
          selectedProgram={selectedCourse}
          renderProgram
        />
      )}
      {preview && isCourseType && searchResults?.nbHits !== 0 && (
        <span className="landing-page-download mt-n5 mb-2">
          <DownloadCsvButton
            // eslint-disable-next-line no-underscore-dangle
            facets={searchResults?._state.disjunctiveFacetsRefinements}
            query={inputQuery}
          />
        </span>
      )}
      <div className="preview-title">
        <p className="h2 ml-2 mt-3 mb-3">
          {contentTitle()}
          {isExecEdType && searchResults?.nbHits !== 0 && (
            <Badge
              className="p-1 ml-2.5 align-middle pl-2 pr-2"
              variant="warning"
            >
              New
            </Badge>
          )}
        </p>
        {searchResults?.nbHits !== 0 && preview && (
          <div className="">
            <Button variant="link" onClick={() => refinementClick()}>
              {linkText}
            </Button>
          </div>
        )}
      </div>
      {searchResults?.nbHits !== 0 && (
        <p className="ml-2 text-gray-700">{contentTitleDescription()}</p>
      )}
      <div className="mb-5">
        {searchResults?.nbHits === 0 && (
          <CatalogNoResultsDeck
            setCardView={setCardView}
            columns={chosenColumn}
            renderCardComponent={renderCardComponent}
            contentType={contentType}
          />
        )}
        {searchResults?.nbHits !== 0 && (
          <DataTable
            isSortable
            dataViewToggleOptions={toggleOptions}
            columns={chosenColumn}
            data={tableData}
            itemCount={searchResults?.nbHits || 0}
            pageCount={searchResults?.nbPages || 1}
            pageSize={searchResults?.hitsPerPage || 0}
            tableActions={dataTableActions}
            RowStatusComponent={preview ? CustomRowStatus : undefined}
          >
            <DataTable.TableControlBar />
            {cardView && (
              <CardView
                columnSizes={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 4,
                  xl: 3,
                }}
                CardComponent={(props) => renderCardComponent(props)}
              />
            )}
            {!cardView && <DataTable.Table />}

            {!preview && (
              <DataTable.TableFooter className="justify-content-center">
                <PaginationComponent defaultRefinement={page} />
              </DataTable.TableFooter>
            )}
          </DataTable>
        )}
      </div>
    </>
  );
};

BaseCatalogSearchResults.defaultProps = {
  searchResults: { disjunctiveFacetsRefinements: [], nbHits: 0, hits: [] },
  error: null,
  paginationComponent: SearchPagination,
  row: null,
  preview: false,
  setNoContent: () => {},
  courseType: null,
};

BaseCatalogSearchResults.propTypes = {
  intl: intlShape.isRequired,
  // from Algolia
  searchResults: PropTypes.shape({
    _state: PropTypes.shape({
      disjunctiveFacetsRefinements: PropTypes.shape({}),
    }),
    disjunctiveFacetsRefinements: PropTypes.arrayOf(PropTypes.shape({})),
    nbHits: PropTypes.number,
    hits: PropTypes.arrayOf(PropTypes.shape({})),
    nbPages: PropTypes.number,
    hitsPerPage: PropTypes.number,
    page: PropTypes.number,
  }),
  isSearchStalled: PropTypes.bool.isRequired,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),

  searchState: PropTypes.shape({
    page: PropTypes.number,
  }).isRequired,
  paginationComponent: PropTypes.func,
  // eslint-disable-next-line react/no-unused-prop-types
  row: PropTypes.string,
  contentType: PropTypes.string.isRequired,
  courseType: PropTypes.string,
  preview: PropTypes.bool,
  setNoContent: PropTypes.func,
};

export default connectStateResults(injectIntl(BaseCatalogSearchResults));
