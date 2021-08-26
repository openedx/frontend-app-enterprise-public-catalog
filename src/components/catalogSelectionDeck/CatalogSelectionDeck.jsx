import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { Container, CardDeck } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import CatalogSelectionCard from '../catalogSelectionCard/CatalogSelectionCard';
import messages from './CatalogSelectionDeck.messages';

const CatalogSelectionDeck = ({ intl, title }) => {
  const config = getConfig();
  return (
    <section className="catalog-selection-deck">
      <Container size="lg">
        <h2>{title}</h2>
        <CardDeck>
          <CatalogSelectionCard
            queryUuid={config.EDX_ENTERPRISE_ALACARTE_UUID}
            label={intl.formatMessage(messages['catalogSelectionDeck.aLaCarte.label'])}
            labelDetail={intl.formatMessage(messages['catalogSelectionDeck.aLaCarte.labelDetail'])}
            cardBody={intl.formatMessage(messages['catalogSelectionDeck.aLaCarte.body'])}
          />
          <CatalogSelectionCard
            queryUuid={config.EDX_FOR_BUSINESS_UUID}
            label={intl.formatMessage(messages['catalogSelectionDeck.edxForBusiness.label'])}
            labelDetail={intl.formatMessage(messages['catalogSelectionDeck.edxForBusiness.labelDetail'])}
            cardBody={intl.formatMessage(messages['catalogSelectionDeck.edxForBusiness.body'])}

          />
          <CatalogSelectionCard
            queryUuid={config.EDX_FOR_ONLINE_EDU_UUID}
            label={intl.formatMessage(messages['catalogSelectionDeck.edxForOnlineEdu.label'])}
            labelDetail={intl.formatMessage(messages['catalogSelectionDeck.edxForOnlineEdu.labelDetail'])}
            cardBody={intl.formatMessage(messages['catalogSelectionDeck.edxForOnlineEdu.body'])}
          />
        </CardDeck>
      </Container>
    </section>
  );
};

CatalogSelectionDeck.propTypes = {
  title: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(CatalogSelectionDeck);
