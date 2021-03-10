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

const ERROR_MESSAGE = 'An error occured while retrieving data';
const NO_DATA_MESSAGE = 'There are no course results';

const TABLE_HEADERS = {
  courseName: 'Course name',
  subject: 'Subject',
  partner: 'Partner',
};

const CatalogSearchResults = ({
  searchResults,
  // algolia recommends this prop instead of searching
  isSearchStalled,
  searchState,
  error,
}) => {
  if (isSearchStalled) {
    return (<Skeleton className="m-1 loading-skeleton" height={25} count={5} />);
  }
  if (error) {
    return (
      <Alert variant="warning">
        {ERROR_MESSAGE}: {error.message}
      </Alert>
    );
  }

  if (searchResults?.nbHits === 0) {
    return (
      <Alert variant="warning">
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
            <SearchPagination defaultRefinement={page} />
          </DataTable.TableFooter>
        </DataTable>
      </div>
    </>
  );
};

CatalogSearchResults.defaultProps = {
  searchResults: { nbHits: 0, hits: [] },
  error: null,
};

CatalogSearchResults.propTypes = {
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
};

export default connectStateResults(CatalogSearchResults);
