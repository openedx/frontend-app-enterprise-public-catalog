import React from 'react';
import { Hyperlink } from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { SearchData, SEARCH_FACET_FILTERS } from '@edx/frontend-enterprise';
import { EnterpriseCatalogs } from '../catalogs';
import Hero from '../hero/Hero';
import CallToAction from '../callToAction/callToAction';
import messages from './CatalogPage.messages';
import { useMarketingSite } from '../catalogs/data/hooks';
import CatalogSelectionDeck from '../catalogSelectionDeck/CatalogSelectionDeck';
import { QUERY_UUID_REFINEMENT } from '../../constants';

const CatalogPage = ({ intl }) => (
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
              <Hyperlink destination="https://business.edx.org">
                {intl.formatMessage(messages['catalogPage.cta.business.link'])}
              </Hyperlink>
            ),
            campusLink: (
              <Hyperlink destination="https://campus.edx.org">
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
      searchFacetFilters={
          [...SEARCH_FACET_FILTERS, { attribute: QUERY_UUID_REFINEMENT, title: 'Catalog Uuids', noDisplay: true }]
      }
    >
      <CatalogSelectionDeck title={intl.formatMessage(messages['catalogPage.catalogSelectionDeck.title'])} />
      <EnterpriseCatalogs />
    </SearchData>
  </main>
);

CatalogPage.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CatalogPage);
