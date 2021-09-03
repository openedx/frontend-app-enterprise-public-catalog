import React, {
  useContext,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { connectStateResults } from 'react-instantsearch-dom';
import {
  Badge, DataTable, Alert, Button, useToggle,
} from '@edx/paragon';
import { SearchContext, SearchPagination } from '@edx/frontend-enterprise-catalog-search';
import Skeleton from 'react-loading-skeleton';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import CatalogCourseInfoModal from '../catalogCourseInfoModal/CatalogCourseInfoModal';
import messages from './CatalogSearchResults.messages';

export const ERROR_MESSAGE = 'An error occured while retrieving data';
export const NO_DATA_MESSAGE = 'There are no course results';

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

  const rowClicked = (row) => {
    const rowPrice = row.original.first_enrollable_paid_seat_price;
    const priceText = (rowPrice != null) ? rowPrice.toString() : intl.formatMessage(
      messages['catalogSearchResult.table.priceNotAvailable'],
    );
    setPrice(priceText);
    setAssociatedCatalogs(row.original.enterprise_catalog_query_uuids);
    setTitle(row.values.title);
    setProvider(row.values['partners[0].name']);
    setPartnerLogoImageUrl(row.original.partners[0].logo_image_url);
    setDescription(row.original.full_description);
    setBannerImageUrl(row.original.original_image_url);
    setMarketingUrl(row.original.marketing_url);
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
      accessor: 'enterprise_catalog_query_uuids',
      Cell: ({ row }) => (
        <div style={{ maxWidth: '400vw' }}>
          { row.values.enterprise_catalog_query_uuids.includes(process.env.EDX_ENTERPRISE_ALACARTE_UUID) && <Badge variant="dark" className="padded-catalog">A la carte</Badge> }
          { row.values.enterprise_catalog_query_uuids.includes(process.env.EDX_FOR_BUSINESS_UUID) && <Badge variant="secondary" className="business-catalog padded-catalog">Business</Badge> }
          { row.values.enterprise_catalog_query_uuids.includes(process.env.EDX_FOR_ONLINE_EDU_UUID) && <Badge variant="light" className="padded-catalog">Education</Badge> }
        </div>
      ),
    },
  ], []);

  const page = refinements.page || (searchState ? searchState.page : 0);

  const tableData = useMemo(() => searchResults?.hits || [], [searchResults?.hits]);
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
      />
      <div>
        <DataTable
          columns={columns}
          data={tableData}
          itemCount={searchResults?.nbHits}
          pageCount={searchResults?.nbPages || 1}
          pageSize={searchResults?.hitsPerPage || 0}
        >
          <DataTable.TableControlBar />
          <DataTable.Table />
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
