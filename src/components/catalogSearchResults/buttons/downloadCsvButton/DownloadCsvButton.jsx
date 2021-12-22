import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';

import { logError } from '@edx/frontend-platform/logging';
import {
  Toast, StatefulButton, Icon, Spinner, useToggle,
} from '@edx/paragon';
import { Download, Check } from '@edx/paragon/icons';

import EnterpriseCatalogApiService from '../../../../data/services/EnterpriseCatalogAPIService';

const DownloadCsvButton = ({ facets, query }) => {
  const [buttonState, setButtonState] = useState('default');

  // If the facets ever change, reset the state of the button
  useEffect(() => {
    if (buttonState !== 'defualt') {
      setButtonState('defualt');
    }
  }, [facets, query]);

  const getCsvFileName = (catalogTitle) => {
    const currentDate = new Date();
    const year = currentDate.getUTCFullYear();
    const month = currentDate.getUTCMonth() + 1;
    const day = currentDate.getUTCDate();
    return `${year}-${month}-${day}-filtered-${catalogTitle.replace(/\s/g, '-')}.csv`;
  };

  const [isOpen, open, close] = useToggle(false);
  const [filters, setFilters] = useState();

  const formatFilterText = (filterObject) => {
    let filterString = '';
    Object.keys(filterObject).forEach(key => {
      const currentFilters = [...filterObject[key]];
      currentFilters.unshift(filterString);
      filterString = currentFilters.join(', ');
    });
    setFilters(filterString.slice(2));
  };

  const handleClick = () => {
    setButtonState('pending');
    EnterpriseCatalogApiService.fetchContentMetadataWithFacets(facets, query)
      .then(response => {
        // download CSV
        const blob = new Blob([response.csv_data], {
          type: 'text/csv',
        });
        saveAs(blob, getCsvFileName(facets.enterprise_catalog_query_titles[0]));
        formatFilterText(facets);
        open();
        setButtonState('complete');
      })
      .catch(err => {
        setButtonState('default');
        logError(err);
        // TODO: what should the UX be for error here?
      });
  };
  const toastText = `Downloaded with filters: ${filters}. Check website for the most up-to-date information on courses.`;
  return (
    <>
      { isOpen
       && (
       <Toast onClose={close} show={isOpen}>
         {toastText}
       </Toast>
       )}
      <StatefulButton
        state={buttonState}
        className="ml-2 download-button"
        labels={{
          default: 'Download results',
          pending: 'Downloading',
          complete: 'Downloaded',
        }}
        icons={{
          default: <Icon src={Download} />,
          pending: <Spinner animation="border" variant="light" size="sm" />,
          complete: <Icon src={Check} />,
        }}
        disabledStates={['pending']}
        onClick={handleClick}
      />
    </>
  );
};

DownloadCsvButton.defaultProps = {
  facets: { nbHits: 0, hits: [] },
  query: null,
};

DownloadCsvButton.propTypes = {
  facets: PropTypes.shape({
    enterprise_catalog_query_titles: PropTypes.array,
  }),
  query: PropTypes.string,
};

export default DownloadCsvButton;
