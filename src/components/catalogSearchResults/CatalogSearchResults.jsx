import React, {
  useContext,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { connectStateResults } from 'react-instantsearch-dom';
import Skeleton from 'react-loading-skeleton';
import classNames from 'classnames';
import queryString from 'query-string';

import {
  Alert, Badge, Button, CardView, DataTable, Icon, IconButton, useToggle,
} from '@edx/paragon';
import {
  SearchContext, SearchPagination, setRefinementAction, useNbHitsFromSearchResults,
} from '@edx/frontend-enterprise-catalog-search';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { GridView, ListView } from '@edx/paragon/icons';

import CourseCard from '../courseCard/CourseCard';
import ProgramCard from '../programCard/ProgramCard';

import CatalogCourseInfoModal from '../catalogCourseInfoModal/CatalogCourseInfoModal';
import DownloadCsvButton from './buttons/downloadCsvButton/DownloadCsvButton';
import messages from './CatalogSearchResults.messages';
import {
  CONTENT_TYPE_REFINEMENT, CONTENT_TYPE_COURSE, CONTENT_TYPE_PROGRAM,
  COURSE_TITLE, HIDE_PRICE_REFINEMENT, PROGRAM_TITLE,
} from '../../constants';

export const ERROR_MESSAGE = 'An error occured while retrieving data';
export const NO_DATA_MESSAGE = 'There are no course results';

export const SKELETON_DATA_TESTID = 'enterprise-catalog-skeleton';

function formatDate(courseRun) {
  if (courseRun) {
    if (courseRun.start && courseRun.end) {
      const startDate = (new Date(courseRun.start)).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
      const endDate = (new Date(courseRun.end)).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${startDate} - ${endDate}`;
    }
  }
  return null;
}
function makePlural(num, string) {
  if (num > 1 || num === 0) { return (`${num} ${string}s`); }
  return (`${num} ${string}`);
}

// TODO: local view toggle compoent. To be replaced by IconButtonToggle from Paragon
const ViewToggle = ({ cardView, setCardView }) => {
  // TODO: This class switch to 'hover' is a hack to try and use the hover style
  //       once the item is selected. However, the correct implementation would need to come
  //       from IconButton. Once IconButton is updated, just update this to use the correct style variation
  const selectedClassCardView = cardView ? 'hover' : '';
  const selectedClassListView = !cardView ? 'hover' : '';
  return (
    <div className="float-right pt-1">
      <IconButton
        src={GridView}
        iconAs={Icon}
        alt="Card view"
        onClick={() => { setCardView(true); }}
        variant="dark"
        className={classNames('mr-2', selectedClassCardView)}
      />
      <IconButton
        src={ListView}
        iconAs={Icon}
        alt="List view"
        onClick={() => { setCardView(false); }}
        variant="dark"
        className={classNames('mr-2', selectedClassListView)}
      />
    </div>
  );
};

ViewToggle.propTypes = {
  cardView: PropTypes.bool.isRequired,
  setCardView: PropTypes.func.isRequired,
};

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
  preview,
}) => {
  const TABLE_HEADERS = {
    courseName: intl.formatMessage(messages['catalogSearchResults.table.courseName']),
    partner: intl.formatMessage(messages['catalogSearchResults.table.partner']),
    price: intl.formatMessage(messages['catalogSearchResults.table.price']),
    availability: intl.formatMessage(messages['catalogSearchResults.table.availability']),
    catalogs: intl.formatMessage(messages['catalogSearchResults.table.catalogs']),
    programName: intl.formatMessage(messages['catalogSearchResults.table.programName']),
    numCourses: intl.formatMessage(messages['catalogSearchResults.table.numCourses']),
    programType: intl.formatMessage(messages['catalogSearchResults.table.programType']),
  };

  if (isSearchStalled) {
    return (
      <div data-testid={SKELETON_DATA_TESTID}>
        <Skeleton
          className="m-1 loading-skeleton"
          height={25}
          count={5}
        />
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

  if (searchResults?.nbHits === 0) {
    return (
      <Alert className="mt-2" variant="warning">
        <FormattedMessage
          id="catalogs.catalogSearchResults.data"
          defaultMessage={NO_DATA_MESSAGE}
          description="Message is displayed when no data is returned (but no error occurs)."
        />
      </Alert>
    );
  }

  const { refinements, dispatch } = useContext(SearchContext);
  const nbHits = useNbHitsFromSearchResults(searchResults);
  const linkText = `Show (${nbHits}) >`;
  const [isOpen, open, close] = useToggle(false);

  const [title, setTitle] = useState();
  const [provider, setProvider] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [partnerLogoImageUrl, setPartnerLogoImageUrl] = useState();
  const [bannerImageUrl, setBannerImageUrl] = useState();
  const [associatedCatalogs, setAssociatedCatalogs] = useState();
  const [marketingUrl, setMarketingUrl] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [upcomingRuns, setUpcomingRuns] = useState();
  const [skillNames, setSkillNames] = useState([]);

  const [cardView, setCardView] = useState(true);

  const rowClicked = (row) => {
    const rowPrice = row.original.first_enrollable_paid_seat_price;
    const priceText = (rowPrice != null) ? `$${rowPrice.toString()}` : intl.formatMessage(
      messages['catalogSearchResult.table.priceNotAvailable'],
    );
    setPrice(priceText);
    setAssociatedCatalogs(row.original.enterprise_catalog_query_titles);
    setTitle(row.values.title);
    setProvider(row.values['partners[0].name']);
    setPartnerLogoImageUrl(row.original.partners[0].logo_image_url);
    setDescription(row.original.full_description);
    setBannerImageUrl(row.original.original_image_url);
    setMarketingUrl(row.original.marketing_url);
    setStartDate(row.original.advertised_course_run.start);
    setEndDate(row.original.advertised_course_run.end);
    setUpcomingRuns(row.original.upcoming_course_runs);
    setSkillNames(row.original.skill_names);
    open();
  };

  const cardClicked = (card) => {
    const rowPrice = card.first_enrollable_paid_seat_price;
    const priceText = (rowPrice != null) ? `$${rowPrice.toString()}` : intl.formatMessage(
      messages['catalogSearchResult.table.priceNotAvailable'],
    );
    setPrice(priceText);
    setAssociatedCatalogs(card.enterprise_catalog_query_titles);
    setTitle(card.title);
    setProvider(card.partners[0].name);
    setPartnerLogoImageUrl(card.partners[0].logo_image_url);
    setDescription(card.full_description);
    setBannerImageUrl(card.original_image_url);
    setMarketingUrl(card.marketing_url);
    setStartDate(card.advertised_course_run.start);
    setEndDate(card.advertised_course_run.end);
    setUpcomingRuns(card.upcoming_course_runs);
    setSkillNames(card.skill_names);
    open();
  };

  const refinementClick = (content) => {
    if (content === CONTENT_TYPE_COURSE) {
      dispatch(setRefinementAction(CONTENT_TYPE_REFINEMENT, [CONTENT_TYPE_COURSE]));
    } else {
      dispatch(setRefinementAction(CONTENT_TYPE_REFINEMENT, [CONTENT_TYPE_PROGRAM]));
    }
  };

  function renderCardComponent(props) {
    if (contentType === CONTENT_TYPE_COURSE) { return <CourseCard {...props} onClick={cardClicked} />; }
    return <ProgramCard {...props} onClick={cardClicked} />;
  }

  // NOTE: Cell is not explicity supported in DataTable, which leads to lint errors regarding {row}. However, we needed
  // to use the accessor functionality instead of just adding in additionalColumns like the Paragon documentation.
  const courseColumns = useMemo(() => [
    {
      Header: TABLE_HEADERS.courseName,
      accessor: 'title',
      Cell: ({ row }) => (
        <Button className="catalog-search-result-column-title" variant="link" onClick={() => rowClicked(row)}>
          {row.values.title}
        </Button>
      ),
    },
    {
      Header: TABLE_HEADERS.partner,
      accessor: 'partners[0].name',
    },
    {
      Header: TABLE_HEADERS.price,
      accessor: 'first_enrollable_paid_seat_price',
      Cell: ({ row }) => (row.values.first_enrollable_paid_seat_price ? `$${row.values.first_enrollable_paid_seat_price}` : null),
    },
    {
      Header: TABLE_HEADERS.catalogs,
      accessor: 'enterprise_catalog_query_titles',
      Cell: ({ row }) => (
        <div style={{ maxWidth: '400vw' }}>
          {
            row.original.enterprise_catalog_query_titles.includes(process.env.EDX_ENTERPRISE_ALACARTE_TITLE)
              && <Badge variant="dark" className="padded-catalog">{intl.formatMessage(messages['catalogSearchResults.aLaCarteBadge'])}</Badge>
          }
          {
            row.original.enterprise_catalog_query_titles.includes(process.env.EDX_FOR_BUSINESS_TITLE)
              && <Badge variant="secondary" className="business-catalog padded-catalog">{intl.formatMessage(messages['catalogSearchResults.businessBadge'])}</Badge>
          }
          {
            row.original.enterprise_catalog_query_titles.includes(process.env.EDX_FOR_ONLINE_EDU_TITLE)
              && <Badge variant="light" className="padded-catalog">{intl.formatMessage(messages['catalogSearchResults.educationBadge'])}</Badge>
          }
        </div>
      ),
    },
  ], []);

  const programColumns = useMemo(() => [
    {
      Header: TABLE_HEADERS.programName,
      accessor: 'title',
      Cell: ({ row }) => (
        <Button className="catalog-search-result-column-title" variant="link" onClick={() => rowClicked(row)}>
          {row.values.title}
        </Button>
      ),
    },
    {
      Header: TABLE_HEADERS.partner,
      accessor: 'authoring_organizations[0].name',
    },
    {
      Header: TABLE_HEADERS.numCourses,
      accessor: 'course_keys',
      Cell: ({ row }) => (row.values.course_keys.length > 0 ? `${row.values.course_keys.length}` : 'Available upon request'),
    },
    {
      Header: TABLE_HEADERS.programType,
      accessor: 'program_type',
    },

    // TODO: Badges commented out until Algolia bug is resolved (ENT-5338)
    // {
    //   Header: TABLE_HEADERS.catalogs,
    //   accessor: 'enterprise_catalog_query_titles',
    //   Cell: ({ row }) => (
    //     <div style={{ maxWidth: '400vw' }}>
    //       {
    //         row.original.enterprise_catalog_query_titles.includes(process.env.EDX_ENTERPRISE_ALACARTE_TITLE)
    //           && <Badge variant="dark" className="padded-catalog">{
    //             intl.formatMessage(messages['catalogSearchResults.aLaCarteBadge'])}</Badge>
    //       }
    //       {
    //         row.original.enterprise_catalog_query_titles.includes(process.env.EDX_FOR_BUSINESS_TITLE)
    //           && <Badge variant="secondary" className="business-catalog padded-catalog">{
    //             intl.formatMessage(messages['catalogSearchResults.businessBadge'])}</Badge>
    //       }
    //       {
    //         row.original.enterprise_catalog_query_titles.includes(process.env.EDX_FOR_ONLINE_EDU_TITLE)
    //           && <Badge variant="light" className="padded-catalog">{
    //             intl.formatMessage(messages['catalogSearchResults.educationBadge'])}</Badge>
    //       }
    //     </div>
    //   ),
    // },
  ], []);

  const availabilityColumn = {
    Header: TABLE_HEADERS.availability,
    accessor: 'advertised_course_run',
    Cell: ({ row }) => (formatDate(row.values.advertised_course_run)),
  };

  // substituting the price column with the availability dates per customer request ENT-5041
  const page = refinements.page || (searchState ? searchState.page : 0);
  if (HIDE_PRICE_REFINEMENT in refinements) {
    courseColumns[2] = availabilityColumn;
  }
  const tableData = useMemo(() => searchResults?.hits || [], [searchResults?.hits]);
  const query = queryString.parse(window.location.search.substring(1));
  const toggleOptions = preview ? {} : {
    isDataViewToggleEnabled: true,
    onDataViewToggle: val => setCardView(val === 'card'),
    togglePlacement: 'left',
    defaultActiveStateValue: 'card',
  };

  function contentTitle() {
    let subTitle = (contentType === CONTENT_TYPE_COURSE) ? COURSE_TITLE : PROGRAM_TITLE;
    if (refinements.q) {
      subTitle = `"${refinements.q}" ${subTitle} (${makePlural(nbHits, 'result')})`;
    }
    return subTitle;
  }

  const inputQuery = query.q;
  return (
    <>
      <CatalogCourseInfoModal
        isOpen={isOpen}
        onClose={close}
        courseTitle={title}
        courseProvider={provider}
        coursePrice={price}
        courseDescription={description}
        partnerLogoImageUrl={partnerLogoImageUrl}
        setBannerImageUrl={setBannerImageUrl}
        bannerImageUrl={bannerImageUrl}
        courseAssociatedCatalogs={associatedCatalogs}
        marketingUrl={marketingUrl}
        startDate={startDate}
        endDate={endDate}
        upcomingRuns={upcomingRuns}
        skillNames={skillNames}
      />
      {preview && contentType === CONTENT_TYPE_COURSE && (
        <span className="landing-page-download">
          <DownloadCsvButton
            facets={searchResults?.disjunctiveFacetsRefinements}
            query={inputQuery}
          />
        </span>
      )}
      <div className="clearfix" />
      {preview && (
      <div className="preview-title">
        <p className="h2 mt-4">{contentTitle()}</p>
        <Button variant="link" onClick={() => refinementClick(contentType)}>{linkText}</Button>
      </div>
      )}
      <DataTable
        isSortable
        dataViewToggleOptions={toggleOptions}
        columns={contentType === CONTENT_TYPE_COURSE ? courseColumns : programColumns}
        data={tableData}
        itemCount={searchResults?.nbHits}
        pageCount={searchResults?.nbPages || 1}
        pageSize={searchResults?.hitsPerPage || 0}
        tableActions={() => {
          if (preview) {
            return null;
          }
          // eslint-disable-next-line no-underscore-dangle
          return <DownloadCsvButton facets={searchResults?._state.disjunctiveFacetsRefinements} query={inputQuery} />;
        }}
      >
        <DataTable.TableControlBar />
        { cardView && (
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
        { !cardView && <DataTable.Table /> }

        {!preview && (
        <DataTable.TableFooter>
          <DataTable.RowStatus />
          <PaginationComponent defaultRefinement={page} />
        </DataTable.TableFooter>
        ) }
      </DataTable>
    </>
  );
};

BaseCatalogSearchResults.defaultProps = {
  searchResults: { disjunctiveFacetsRefinements: [], nbHits: 0, hits: [] },
  error: null,
  paginationComponent: SearchPagination,
  row: null,
  preview: false,
};

BaseCatalogSearchResults.propTypes = {
  intl: intlShape.isRequired,
  // from Algolia
  searchResults: PropTypes.shape({
    _state: PropTypes.shape({
      disjunctiveFacetsRefinements: PropTypes.shape({}),
    }),
    disjunctiveFacetsRefinements: PropTypes.array,
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
  preview: PropTypes.bool,
};

export default connectStateResults(injectIntl(BaseCatalogSearchResults));
