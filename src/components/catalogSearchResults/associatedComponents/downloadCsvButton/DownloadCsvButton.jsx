import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Toast, Button, useToggle,
} from '@edx/paragon';
import { Download } from '@edx/paragon/icons';

import EnterpriseCatalogApiService from '../../../../data/services/EnterpriseCatalogAPIService';

const DownloadCsvButton = ({ facets, query }) => {
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
    formatFilterText(facets);
    open();
    const downloadUrl = EnterpriseCatalogApiService.generateCsvDownloadLink(facets, query);
    global.location.href = downloadUrl;
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
      <Button className="ml-2 download-button" iconBefore={Download} onClick={handleClick}>
        Download results
      </Button>
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
