import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { Container, CardDeck } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import CatalogSelectionCard from '../catalogSelectionCard/CatalogSelectionCard';
import messages from './CatalogSelectionDeck.messages';

const businessClassName = 'business-catalog';
const aLaCarteVariant = 'dark';
const businessVariant = 'secondary';
const educationVariant = 'light';

function CatalogSelectionDeck({ intl, title, hide }) {
  const config = getConfig();
  return (
    <section
      className="catalog-selection-deck"
      style={{ display: hide ? 'none' : 'block' }}
    >
      <Container className="page-width">
        <h2>{title}</h2>
        {/* TODO: The previously used `CardDeck` is since deprecated. However,
        this use case is more relevant to `SelectableBox` than `CardDeck` */}
        <CardDeck.Deprecated>
          <CatalogSelectionCard
            queryTitle={config.EDX_ENTERPRISE_ALACARTE_TITLE}
            badgeVariant={aLaCarteVariant}
            badge={intl.formatMessage(
              messages['catalogSelectionDeck.aLaCarte.badge'],
            )}
            label={intl.formatMessage(
              messages['catalogSelectionDeck.aLaCarte.label'],
            )}
            labelDetail={intl.formatMessage(
              messages['catalogSelectionDeck.aLaCarte.labelDetail'],
            )}
            cardBody={intl.formatMessage(
              messages['catalogSelectionDeck.aLaCarte.body'],
            )}
          />
          <CatalogSelectionCard
            queryTitle={config.EDX_FOR_BUSINESS_TITLE}
            className={businessClassName}
            badgeVariant={businessVariant}
            badge={intl.formatMessage(
              messages['catalogSelectionDeck.edxForBusiness.badge'],
            )}
            label={intl.formatMessage(
              messages['catalogSelectionDeck.edxForBusiness.label'],
            )}
            labelDetail={intl.formatMessage(
              messages['catalogSelectionDeck.edxForBusiness.labelDetail'],
            )}
            cardBody={intl.formatMessage(
              messages['catalogSelectionDeck.edxForBusiness.body'],
            )}
          />
          <CatalogSelectionCard
            queryTitle={config.EDX_FOR_ONLINE_EDU_TITLE}
            badgeVariant={educationVariant}
            badge={intl.formatMessage(
              messages['catalogSelectionDeck.edxForOnlineEdu.badge'],
            )}
            label={intl.formatMessage(
              messages['catalogSelectionDeck.edxForOnlineEdu.label'],
            )}
            labelDetail={intl.formatMessage(
              messages['catalogSelectionDeck.edxForOnlineEdu.labelDetail'],
            )}
            cardBody={intl.formatMessage(
              messages['catalogSelectionDeck.edxForOnlineEdu.body'],
            )}
          />
        </CardDeck.Deprecated>
      </Container>
    </section>
  );
}

CatalogSelectionDeck.defaultProps = {
  hide: false,
};

CatalogSelectionDeck.propTypes = {
  title: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  hide: PropTypes.bool,
};

export default injectIntl(CatalogSelectionDeck);
