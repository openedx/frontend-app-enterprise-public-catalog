import { Alert, CardView, DataTable } from '@edx/paragon';
import React, { useEffect, useState } from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';
import PropTypes from 'prop-types';

import {
  CONTENT_TYPE_COURSE,
  CONTENT_TYPE_PROGRAM,
  NO_RESULTS_DECK_ITEM_COUNT,
  NO_RESULTS_PAGE_SIZE,
  NO_RESULTS_PAGE_ITEM_COUNT,
} from '../../constants';
import messages from './CatalogNoResultsDeck.messages';
import EnterpriseCatalogApiService from '../../data/services/EnterpriseCatalogAPIService';
import { getSelectedCatalogFromURL } from '../../utils';

const BASE_APP_URL = process.env.BASE_URL;

const CatalogNoResultsDeck = ({
  intl,
  setCardView,
  columns,
  renderCardComponent,
  contentType,
}) => {
  const [defaultData, setDefaultData] = useState([]);
  const [apiError, setApiError] = useState(false);

  const selectedCatalog = getSelectedCatalogFromURL();
  let redirect;
  if (selectedCatalog) {
    redirect = `${BASE_APP_URL}/?enterprise_catalog_query_titles=${encodeURIComponent(selectedCatalog)}`;
  } else {
    redirect = BASE_APP_URL;
  }

  useEffect(() => {
    const defaultCoursesRefinements = { enterprise_catalog_query_titles: selectedCatalog, content_type: contentType };
    EnterpriseCatalogApiService.fetchDefaultCoursesInCatalogWithFacets(defaultCoursesRefinements).then(response => {
      setDefaultData(response.default_content);
      setApiError(false);
    }).catch(err => {
      setApiError(true);
      logError(err);
      // TODO: what should the UX be for error here?
    });
  }, [selectedCatalog]);

  let defaultDeckTitle;
  let alertText;
  if (contentType === CONTENT_TYPE_COURSE) {
    alertText = intl.formatMessage(messages['catalogSearchResults.NoResultsCourseBannerText']);
    defaultDeckTitle = intl.formatMessage(messages['catalogSearchResults.DefaultCourseDeckTitle']);
  } else if (contentType === CONTENT_TYPE_PROGRAM) {
    alertText = intl.formatMessage(messages['catalogSearchResults.NoResultsProgramBannerText']);
    defaultDeckTitle = intl.formatMessage(messages['catalogSearchResults.DefaultProgramDeckTitle']);
  }
  return (
    <>
      <Alert className="mt-2" variant="info" data-testid="noResultsAlertTestId">
        <Alert.Heading>{intl.formatMessage(messages['catalogSearchResults.NoResultsBannerTitle'])}</Alert.Heading>
        {alertText}
        <Alert.Link href={redirect}>
          {intl.formatMessage(messages['catalogSearchResults.NoResultsBannerHyperlinkText'])}
        </Alert.Link>
      </Alert>
      { (!apiError) && (
        <h3 className="mt-4.5 mb-3.5" data-testid="noResultsDeckTitleTestId">{defaultDeckTitle}</h3>
      )}
      <DataTable
        dataViewToggleOptions={{
          isDataViewToggleEnabled: true,
          onDataViewToggle: val => setCardView(val === 'card'),
          togglePlacement: 'left',
          defaultActiveStateValue: 'card',
        }}
        columns={columns}
        data={defaultData}
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
};

CatalogNoResultsDeck.propTypes = {
  contentType: PropTypes.string,
  intl: intlShape.isRequired,
  setCardView: PropTypes.func,
  renderCardComponent: PropTypes.func,
  columns: PropTypes.arrayOf(PropTypes.shape({})),
};

export default injectIntl(CatalogNoResultsDeck);
