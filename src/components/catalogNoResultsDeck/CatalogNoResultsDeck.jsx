import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStateResults } from 'react-instantsearch-dom';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Alert, CardView, DataTable } from '@openedx/paragon';

import {
  CONTENT_TYPE_COURSE,
  CONTENT_TYPE_PROGRAM,
  EXEC_ED_TITLE,
  NO_RESULTS_DECK_ITEM_COUNT,
  NO_RESULTS_PAGE_SIZE,
  NO_RESULTS_PAGE_ITEM_COUNT,
} from '../../constants';
import messages from './CatalogNoResultsDeck.messages';
import { getSelectedCatalogFromURL } from '../../utils/common';

const BASE_APP_URL = process.env.BASE_URL;

const CatalogNoResultsDeck = ({
  intl,
  setCardView,
  columns,
  renderCardComponent,
  contentType,
  searchResults,
}) => {
  const tableData = useMemo(
    () => searchResults?.hits || [],
    [searchResults?.hits],
  );

  const selectedCatalog = getSelectedCatalogFromURL();
  let redirect;
  if (selectedCatalog) {
    redirect = `${BASE_APP_URL}/?enterprise_catalog_query_titles=${encodeURIComponent(
      selectedCatalog,
    )}`;
  } else {
    redirect = BASE_APP_URL;
  }

  let defaultDeckTitle;
  let alertText;
  if (contentType === CONTENT_TYPE_COURSE) {
    alertText = intl.formatMessage(
      messages['catalogSearchResults.NoResultsCourseBannerText'],
    );
    defaultDeckTitle = intl.formatMessage(
      messages['catalogSearchResults.DefaultCourseDeckTitle'],
    );
  } else if (contentType === EXEC_ED_TITLE) {
    alertText = intl.formatMessage(
      messages['catalogSearchResults.NoResultsExecEdCourseBannerText'],
    );
    defaultDeckTitle = intl.formatMessage(
      messages['catalogSearchResults.DefaultExecEdCourseDeckTitle'],
    );
  } else if (contentType === CONTENT_TYPE_PROGRAM) {
    alertText = intl.formatMessage(
      messages['catalogSearchResults.NoResultsProgramBannerText'],
    );
    defaultDeckTitle = intl.formatMessage(
      messages['catalogSearchResults.DefaultProgramDeckTitle'],
    );
  }
  return (
    <>
      <Alert className="mt-2" variant="info" data-testid="noResultsAlertTestId">
        <Alert.Heading>
          {intl.formatMessage(
            messages['catalogSearchResults.NoResultsBannerTitle'],
          )}
        </Alert.Heading>
        {alertText}
        <Alert.Link href={redirect}>
          {intl.formatMessage(
            messages['catalogSearchResults.NoResultsBannerHyperlinkText'],
          )}
        </Alert.Link>
      </Alert>

      <h3 className="mt-4.5 mb-3.5" data-testid="noResultsDeckTitleTestId">
        {defaultDeckTitle}
      </h3>
      <DataTable
        dataViewToggleOptions={{
          isDataViewToggleEnabled: true,
          onDataViewToggle: (val) => setCardView(val === 'card'),
          togglePlacement: 'left',
          defaultActiveStateValue: 'card',
        }}
        columns={columns}
        data={tableData}
        itemCount={NO_RESULTS_DECK_ITEM_COUNT}
        pageCount={NO_RESULTS_PAGE_ITEM_COUNT}
        pageSize={NO_RESULTS_PAGE_SIZE}
      >
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
      </DataTable>
    </>
  );
};

CatalogNoResultsDeck.defaultProps = {
  setCardView: () => {},
  renderCardComponent: () => {},
  columns: [],
  contentType: '',
  searchResults: {},
};

CatalogNoResultsDeck.propTypes = {
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
  contentType: PropTypes.string,
  intl: intlShape.isRequired,
  setCardView: PropTypes.func,
  renderCardComponent: PropTypes.func,
  columns: PropTypes.arrayOf(PropTypes.shape({})),
};

export default connectStateResults(injectIntl(CatalogNoResultsDeck));
