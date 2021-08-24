import React from 'react';
import { Hyperlink } from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { SearchData, SEARCH_FACET_FILTERS } from '@edx/frontend-enterprise-catalog-search';
import { getConfig } from '@edx/frontend-platform';
import { EnterpriseCatalogs } from '../catalogs';
import Hero from '../hero/Hero';
import CallToAction from '../callToAction/callToAction';
import messages from './CatalogPage.messages';
import { useMarketingSite } from '../catalogs/data/hooks';
import CatalogSelectionDeck from '../catalogSelectionDeck/CatalogSelectionDeck';
import {
  AVAILABILITY_REFINEMENT, AVAILABILITY_REFINEMENT_DEFAULTS, QUERY_UUID_REFINEMENT, TRACKING_APP_NAME,
} from '../../constants';

const CatalogPage = ({ intl }) => {
  const config = getConfig();
  // Default routing:
  //   1. If our url on load does not have a catalog parameter set, set one.
  //   2. If our url on load does not have an availability param set, set to available and
  //      upcoming courses.
  // Doing this via Url Params will cause a page reload for visitors coming from the main URL, but
  // it's the only way to keep infinite loops out of the rest of the page and display data that
  // is cohesive with those Url params the rest of the time.
  const loadedSearchParams = new URLSearchParams(window.location.search);
  let reloadPage = false;
  if (config.EDX_ENTERPRISE_ALACARTE_UUID && (!loadedSearchParams.get(QUERY_UUID_REFINEMENT))) {
    loadedSearchParams.set(QUERY_UUID_REFINEMENT, config.EDX_ENTERPRISE_ALACARTE_UUID);
    reloadPage = true;
  }
  if ((!loadedSearchParams.get(AVAILABILITY_REFINEMENT))) {
    loadedSearchParams.set(AVAILABILITY_REFINEMENT, AVAILABILITY_REFINEMENT_DEFAULTS);
    reloadPage = true;
  }
  if (reloadPage) {
    window.location.search = loadedSearchParams.toString();
  }

  return (
    <main>
      <Hero
        text={intl.formatMessage(messages['catalogPage.hero.text'])}
        highlight={intl.formatMessage(messages['catalogPage.hero.highlight'])}
      />
      <CallToAction
        buttonText={intl.formatMessage(messages['catalogPage.cta.button.text'])}
        buttonLink={useMarketingSite()}
        highlighted={intl.formatMessage(messages['catalogPage.cta.business.link'])}
      >
        <span>
          <FormattedMessage
            id="catalogPage.cta.text"
            defaultMessage="Explore comprehensive course catalogs curated {businessLink} and {campusLink} or work with an edX representative to customize a solution for your unique needs."
            description="Description of the catalog contents and navigation to other edX pages."
            values={{
              businessLink: (
                <Hyperlink destination="https://business.edx.org" target="_blank" rel="noopener noreferrer">
                  {intl.formatMessage(messages['catalogPage.cta.business.link'])}
                </Hyperlink>
              ),
              campusLink: (
                <Hyperlink destination="https://campus.edx.org" target="_blank" rel="noopener noreferrer">
                  <FormattedMessage
                    id="catalogPage.cta.campus.link"
                    defaultMessage="for educational institutions"
                    description="Hyperlink text that directs users to our online campus course page"
                  />
                </Hyperlink>
              ),
            }}
          />
        </span>
      </CallToAction>
      <SearchData
        trackingName={TRACKING_APP_NAME}
        searchFacetFilters={
        [...SEARCH_FACET_FILTERS, { attribute: QUERY_UUID_REFINEMENT, title: 'Catalog Uuids', noDisplay: true }]
      }
      >
        <CatalogSelectionDeck title={intl.formatMessage(messages['catalogPage.catalogSelectionDeck.title'])} />
        <EnterpriseCatalogs />
      </SearchData>
    </main>
  );
};

CatalogPage.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CatalogPage);
