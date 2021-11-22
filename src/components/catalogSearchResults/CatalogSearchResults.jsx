/* eslint-disable camelcase */
import React, {
  useContext,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { connectStateResults } from 'react-instantsearch-dom';
import {
  Badge, DataTable, Alert, Button, useToggle, CardView, Card, Icon, IconButton,
} from '@edx/paragon';
import { SearchContext, SearchPagination } from '@edx/frontend-enterprise-catalog-search';
import Skeleton from 'react-loading-skeleton';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { getConfig } from '@edx/frontend-platform';
import { GridView, ListView } from '@edx/paragon/icons';
import CatalogCourseInfoModal from '../catalogCourseInfoModal/CatalogCourseInfoModal';
import messages from './CatalogSearchResults.messages';
import { HIDE_PRICE_REFINEMENT } from '../../constants';

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

const CourseCard = ({ className, original }) => {
  const { title, card_image_url, partners } = original;

  return (
    <Card className={className}>
      <Card.Img
        variant="top"
        src={card_image_url}
        style={{ width: '48vh', height: '26vh' }}
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle>{ partners[0].name } </Card.Subtitle>
      </Card.Body>
    </Card>
  );
};

CourseCard.propTypes = {
  className: PropTypes.string.isRequired,
  original: PropTypes.shape({
    title: PropTypes.string,
    card_image_url: PropTypes.string,
    partners: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
  }).isRequired,
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
 */
export const BaseCatalogSearchResults = ({
  intl,
  searchResults,
  // algolia recommends this prop instead of searching
  isSearchStalled,
  searchState,
  error,
  paginationComponent: PaginationComponent,
}) => {
  const TABLE_HEADERS = {
    courseName: intl.formatMessage(messages['catalogSearchResults.table.courseName']),
    partner: intl.formatMessage(messages['catalogSearchResults.table.partner']),
    price: intl.formatMessage(messages['catalogSearchResults.table.price']),
    availability: intl.formatMessage(messages['catalogSearchResults.table.availability']),
    catalogs: intl.formatMessage(messages['catalogSearchResults.table.catalogs']),
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

  const { refinements } = useContext(SearchContext);
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
  const [cardView, setCardView] = useState(true);

  // TODO: Feature control for Card view. Remove once cards are finalized
  const config = getConfig();
  const cardViewEnabled = config.FEATURE_CARD_VIEW_ENABLED === 'true';

  // TODO: local view toggle compoent. To be replaced by IconButtonToggle from Paragon
  const ViewToggle = () => (
    <div className="float-right">
      <IconButton
        src={GridView}
        iconAs={Icon}
        alt="Card view"
        onClick={() => { setCardView(true); }}
        variant="dark"
        className="mr-2"
      />
      <IconButton
        src={ListView}
        iconAs={Icon}
        alt="Card view"
        onClick={() => { setCardView(false); }}
        variant="dark"
        className="mr-2"
      />
    </div>
  );

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
    open();
  };

  // NOTE: Cell is not explicity supported in DataTable, which leads to lint errors regarding {row}. However, we needed
  // to use the accessor functionality instead of just adding in additionalColumns like the Paragon documentation.
  const columns = useMemo(() => [
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
  const availabilityColumn = {
    Header: TABLE_HEADERS.availability,
    accessor: 'advertised_course_run',
    Cell: ({ row }) => (formatDate(row.values.advertised_course_run)),
  };

  // substituting the price column with the availability dates per customer request ENT-5041
  const page = refinements.page || (searchState ? searchState.page : 0);
  if (HIDE_PRICE_REFINEMENT in refinements) {
    columns[2] = availabilityColumn;
  }
  const tableData = useMemo(() => searchResults?.hits || [], [searchResults?.hits]);
  tableData.push({ ...tableData[0], title: 'new course 2' });
  tableData.push({ ...tableData[0], title: 'new course 3', card_image_url: 'https://picsum.photos/200/300' });
  tableData.push({ ...tableData[0], title: 'new course 4', card_image_url: 'https://source.unsplash.com/category/nature' });
  tableData.push({ ...tableData[0], title: 'new course 5', card_image_url: 'https://source.unsplash.com/category/food' });
  tableData.push({ ...tableData[0], title: 'new course 6', card_image_url: 'https://picsum.photos/200/300' });
  tableData.push({ ...tableData[0], title: 'new course 7', card_image_url: 'https://picsum.photos/200/300' });
  tableData.push({ ...tableData[0], title: 'new course 8', card_image_url: 'https://picsum.photos/200/300' });
  tableData.push({ ...tableData[0], title: 'new course 9', card_image_url: 'https://picsum.photos/200/300' });
  tableData.push({ ...tableData[0], title: 'new course 10', card_image_url: 'https://picsum.photos/200/300' });
  tableData.push({ ...tableData[0], title: 'new course 11', card_image_url: 'https://picsum.photos/200/300' });
  tableData.push({ ...tableData[0], title: 'new course 12', card_image_url: 'https://picsum.photos/200/300' });
  tableData.push({ ...tableData[0], title: 'new course 13', card_image_url: 'https://picsum.photos/200/300' });
  tableData.push({ ...tableData[0], title: 'new course 6', card_image_url: 'https://picsum.photos/200/300' });
  tableData.push({ ...tableData[0], title: 'new course 6', card_image_url: 'https://picsum.photos/200/300' });
  tableData.push({ ...tableData[0], title: 'new course 6', card_image_url: 'https://picsum.photos/200/300' });

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
      />
      <div>
        { cardViewEnabled && <ViewToggle /> }
        <DataTable
          columns={columns}
          data={tableData}
          itemCount={searchResults?.nbHits}
          pageCount={searchResults?.nbPages || 1}
          pageSize={searchResults?.hitsPerPage || 0}
        >
          <DataTable.TableControlBar />
          { cardViewEnabled && cardView ? <CardView CardComponent={CourseCard} /> : <DataTable.Table /> }
          <DataTable.TableFooter>
            <DataTable.RowStatus />
            <PaginationComponent defaultRefinement={page} />
          </DataTable.TableFooter>
        </DataTable>
      </div>
    </>
  );
};

BaseCatalogSearchResults.defaultProps = {
  searchResults: { nbHits: 0, hits: [] },
  error: null,
  paginationComponent: SearchPagination,
  row: null,
};

BaseCatalogSearchResults.propTypes = {
  intl: intlShape.isRequired,
  // from Algolia
  searchResults: PropTypes.shape({
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
};

export default connectStateResults(injectIntl(BaseCatalogSearchResults));
