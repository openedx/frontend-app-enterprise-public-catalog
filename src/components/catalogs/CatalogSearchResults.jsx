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
import LoadingMessage from '../LoadingMessage';

const ERROR_MESSAGE = 'An error occured while retrieving data';
const NO_DATA_MESSAGE = 'There are no course results';

const TABLE_HEADERS = {
  courseName: 'Course name',
  subject: 'Subject',
  partner: 'Partner',
};

const SimpleDisplayCell = ({ value }) => <>{value}</>;

SimpleDisplayCell.propTypes = {
  value: PropTypes.string.isRequired,
};

const CatalogSearchResults = ({
  searchResults,
  // algolia recommends this prop instead of searching
  isSearchStalled,
  searchState,
  error,
}) => {
  const { refinementsFromQueryParams } = useContext(SearchContext);
  const columns = useMemo(() => [
    {
      Header: TABLE_HEADERS.courseName,
      accessor: 'title',
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => <SimpleDisplayCell value={value} />,
    },
    {
      Header: TABLE_HEADERS.subject,
      accessor: 'subjects[0]',
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => <SimpleDisplayCell value={value} />,
    },
    {
      Header: TABLE_HEADERS.partner,
      accessor: 'partners[0].name',
      // eslint-disable-next-line react/prop-types
      Cell: ({ value }) => <SimpleDisplayCell value={value} />,
    },
  ], []);

  const page = useMemo(
    () => {
      if (refinementsFromQueryParams.page) {
        return refinementsFromQueryParams.page;
      }
      return searchState && searchState.page;
    },
    [searchState?.page, refinementsFromQueryParams],
  );

  if (isSearchStalled) {
    return (<LoadingMessage className="overview mt-3" />);
  }

  if (!isSearchStalled && error) {
    return (
      <StatusAlert
        alertType="danger"
        iconClassName="fa fa-times-circle"
        message={`${ERROR_MESSAGE} ${error.message}`}
      />
    );
  }
  if (!isSearchStalled && searchResults?.nbHits === 0) {
    return (
      <StatusAlert
        alertType="warning"
        iconClassName="fa fa-exclamation-circle"
        message={NO_DATA_MESSAGE}
      />
    );
  }

  return (
    <>
      <div>
        <DataTable
          columns={columns}
          data={searchResults?.hits || []}
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
