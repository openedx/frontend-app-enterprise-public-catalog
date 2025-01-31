import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Icon, Toast, useToggle, StatefulButton, Spinner, Form,
} from '@openedx/paragon';
import { Check, Close, Download } from '@openedx/paragon/icons';
import { saveAs } from 'file-saver';
import { useIntl, FormattedMessage } from '@edx/frontend-platform/i18n';

import EnterpriseCatalogApiService from '../../../../data/services/EnterpriseCatalogAPIService';

const DownloadCsvButton = ({ facets, query }) => {
  const [isOpen, open, close] = useToggle(false);
  const [filters, setFilters] = useState();
  const [buttonState, setButtonState] = useState('default');
  const [shouldUseLearnerPortalLinks, setShouldUseLearnerPortalLinks] = useState(false);
  const handleChange = e => setShouldUseLearnerPortalLinks(e.target.checked);

  const intl = useIntl();

  const formatFilterText = (filterObject) => {
    let filterString = '';
    Object.keys(filterObject).forEach((key) => {
      const currentFilters = [...filterObject[key]];
      currentFilters.unshift(filterString);
      filterString = currentFilters.join(', ');
    });
    setFilters(filterString.slice(2));
  };

  const handleClick = () => {
    formatFilterText(facets);
    open();
    setButtonState('pending');
    EnterpriseCatalogApiService.generateCsvDownloadLink(
      shouldUseLearnerPortalLinks ? { ...facets, use_learner_portal_url: shouldUseLearnerPortalLinks } : facets,
      query,
    ).then(response => {
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const timestamp = new Date().toISOString();
      saveAs(blob, `Enterprise-Catalog-Export-${timestamp}.xlsx`);
      setButtonState('complete');
    }).catch(() => setButtonState('error'));
  };

  const toastText = intl.formatMessage({
    id: 'catalogs.catalogSearchResults.downloadCsv.toastText',
    defaultMessage: 'Downloaded with filters: {filters}. Check website for the most up-to-date information on courses.',
    description: 'Toast text to be displayed when the user clicks the download button on the catalog page.',
  }, { filters });
  return (
    <>
      {isOpen && (
        <Toast onClose={close} show={isOpen}>
          {toastText}
        </Toast>
      )}
      <div className="d-flex align-items-center">
        <Form.Switch checked={shouldUseLearnerPortalLinks} onChange={handleChange} className="mr-1">
          <FormattedMessage
            id="catalogs.catalogSearchResults.downloadCsv.useLearnerPortalLinks"
            defaultMessage="Use learner portal links"
            description="Switch to toggle whether to use learner portal links in the CSV download."
          />
        </Form.Switch>
        <StatefulButton
          state={buttonState}
          variant={buttonState === 'error' ? 'danger' : 'primary'}
          labels={{
            default: intl.formatMessage({
              id: 'catalogs.catalogSearchResults.downloadCsv.button.default',
              defaultMessage: 'Download results',
              description: 'Label for the download button on the catalog search results page.',
            }),
            pending: intl.formatMessage({
              id: 'catalogs.catalogSearchResults.downloadCsv.button.pending',
              defaultMessage: 'Downloading results',
              description: 'Label for the download button on the catalog search results page when the download is in progress.',
            }),
            complete: intl.formatMessage({
              id: 'catalogs.catalogSearchResults.downloadCsv.button.complete',
              defaultMessage: 'Download complete',
              description: 'Label for the download button on the catalog search results page when the download is complete.',
            }),
            error: intl.formatMessage({
              id: 'catalogs.catalogSearchResults.downloadCsv.button.error',
              defaultMessage: 'Error',
              description: 'Label for the download button on the catalog search results page when the download fails.',
            }),
          }}
          icons={{
            default: <Icon src={Download} />,
            pending: <Spinner animation="border" variant="light" size="sm" />,
            complete: <Icon src={Check} />,
            error: <Icon src={Close} variant="light" size="sm" />,
          }}
          disabledStates={['disabled', 'pending']}
          onClick={handleClick}
        />
      </div>
    </>
  );
};

DownloadCsvButton.defaultProps = {
  facets: { nbHits: 0, hits: [] },
  query: null,
};

DownloadCsvButton.propTypes = {
  facets: PropTypes.shape({
    enterprise_catalog_query_titles: PropTypes.arrayOf(PropTypes.string),
  }),
  query: PropTypes.string,
};

export default DownloadCsvButton;
