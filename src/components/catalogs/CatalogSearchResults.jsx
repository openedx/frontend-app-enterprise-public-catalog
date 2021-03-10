import React, {
  useContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { connectStateResults } from 'react-instantsearch-dom';
import {
  DataTable, StatusAlert,
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
    return (<Skeleton height={25} />);
  }
  if (error) {
    return (
      <StatusAlert
        alertType="danger"
        iconClassName="fa fa-times-circle"
        message={`${ERROR_MESSAGE} ${error.message}`}
      />
    );
  }

  if (searchResults?.nbHits === 0) {
    return (
      <StatusAlert
        alertType="warning"
        iconClassName="fa fa-exclamation-circle"
        message={NO_DATA_MESSAGE}
      />
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

  const calculatePage = () => {
    if (refinementsFromQueryParams.page) {
      return refinementsFromQueryParams.page;
    }
    return searchState && searchState.page;
  };

  const page = useMemo(
    calculatePage,
    [calculatePage, searchState?.page, refinementsFromQueryParams?.page],
  );

  const tableData = useMemo(() => searchResults?.hits || [], [searchResults?.hits]);
  return (
    <>
      <div>
        <DataTable
          columns={columns}
          data={tableData}
          itemCount={searchResults?.nbHits}
          isSelectable
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
