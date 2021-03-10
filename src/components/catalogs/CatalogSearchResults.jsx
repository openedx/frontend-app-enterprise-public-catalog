import React, {
  useContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { connectStateResults } from 'react-instantsearch-dom';
import {
  DataTable, Alert,
} from '@edx/paragon';
import { SearchContext, SearchPagination } from '@edx/frontend-enterprise';
import Skeleton from 'react-loading-skeleton';

export const ERROR_MESSAGE = 'An error occured while retrieving data';
export const NO_DATA_MESSAGE = 'There are no course results';

const TABLE_HEADERS = {
  courseName: 'Course name',
  subject: 'Subject',
  partner: 'Partner',
};

/**
 * The core search resultss rendering component.
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
  searchResults,
  // algolia recommends this prop instead of searching
  isSearchStalled,
  searchState,
  error,
  paginationComponent: PaginationComponent = SearchPagination,
}) => {
  if (isSearchStalled) {
    return (<Skeleton className="m-1 loading-skeleton" height={25} count={5} />);
  }
  if (error) {
    return (
      <Alert className="mt-2" variant="warning">
        {ERROR_MESSAGE}: {error.message}
      </Alert>
    );
  }

  if (searchResults?.nbHits === 0) {
    return (
      <Alert className="mt-2" variant="warning">
        {NO_DATA_MESSAGE}
      </Alert>
    );
  }

  const { refinementsFromQueryParams } = useContext(SearchContext);
  const columns = useMemo(() => [
    {
      Header: TABLE_HEADERS.courseName,
      accessor: 'title',
    },
    {
      Header: TABLE_HEADERS.subject,
      accessor: 'subjects[0]',
    },
    {
      Header: TABLE_HEADERS.partner,
      accessor: 'partners[0].name',
    },
  ], []);

  const page = refinementsFromQueryParams.page || (searchState ? searchState.page : 0);

  const tableData = useMemo(() => searchResults?.hits || [], [searchResults?.hits]);
  return (
    <>
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
};

BaseCatalogSearchResults.propTypes = {
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
  paginationComponent: PropTypes.node.isRequired,
};

export default connectStateResults(BaseCatalogSearchResults);
