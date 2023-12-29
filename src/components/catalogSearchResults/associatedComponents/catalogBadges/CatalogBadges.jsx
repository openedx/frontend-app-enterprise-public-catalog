import { Badge } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

import React from 'react';
import messages from '../../CatalogSearchResults.messages';
import features from '../../../../config';

const CatalogBadges = ({ row }) => {
  const intl = useIntl();
  return (
    <div style={{ maxWidth: '400vw' }}>
      {row.original.enterprise_catalog_query_titles.includes(
        process.env.EDX_ENTERPRISE_ALACARTE_TITLE,
      ) && (
        <Badge variant="dark" className="padded-catalog">
          {intl.formatMessage(messages['catalogSearchResults.aLaCarteBadge'])}
        </Badge>
      )}
      {row.original.enterprise_catalog_query_titles.includes(
        process.env.EDX_FOR_BUSINESS_TITLE,
      ) && (
        <Badge variant="secondary" className="business-catalog padded-catalog">
          {intl.formatMessage(messages['catalogSearchResults.businessBadge'])}
        </Badge>
      )}
      {!features.CONSOLIDATE_SUBS_CATALOG
        && row.original.enterprise_catalog_query_titles.includes(
          process.env.EDX_FOR_ONLINE_EDU_TITLE,
        ) && (
        <Badge variant="light" className="padded-catalog">
          {intl.formatMessage(messages['catalogSearchResults.educationBadge'])}
        </Badge>
      )}
    </div>
  );
};

CatalogBadges.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      enterprise_catalog_query_titles: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
};

export default CatalogBadges;
