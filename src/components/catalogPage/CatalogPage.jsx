import React from 'react';
import { Hyperlink } from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { EnterpriseCatalogs } from '../catalogs';
import Hero from '../hero/Hero';
import CallToAction from '../callToAction/callToAction';
import messages from './CatalogPage.messages';

const ctaButtonLink = 'https://business.edx.org/schedule';

const CatalogPage = ({ intl }) => (
  <main>
    <Hero
      text={intl.formatMessage(messages['catalogPage.hero.text'])}
      highlight={intl.formatMessage(messages['catalogPage.hero.highlight'])}
    />
    <CallToAction
      buttonText={intl.formatMessage(messages['catalogPage.cta.button.text'])}
      buttonLink={ctaButtonLink}
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
    <EnterpriseCatalogs />
  </main>
);

CatalogPage.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CatalogPage);
