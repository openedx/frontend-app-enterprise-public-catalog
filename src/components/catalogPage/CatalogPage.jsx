import React from 'react';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import {
  SearchData,
  SEARCH_FACET_FILTERS,
} from '@edx/frontend-enterprise-catalog-search';
import { getConfig } from '@edx/frontend-platform';
import { useLocation } from 'react-router-dom';
import { CatalogSearch } from '../catalogs';
import Subheader from '../subheader/subheader';
import Hero from '../hero/Hero';
import messages from './CatalogPage.messages';
import CatalogSelectionDeck from '../catalogSelectionDeck/CatalogSelectionDeck';
import {
  AVAILABILITY_REFINEMENT,
  AVAILABILITY_REFINEMENT_DEFAULTS,
  EXEC_ED_TITLE,
  LEARNING_TYPE_REFINEMENT,
  QUERY_TITLE_REFINEMENT,
  HIDE_CARDS_REFINEMENT,
  TRACKING_APP_NAME,
} from '../../constants';

const learningType = {
  attribute: LEARNING_TYPE_REFINEMENT,
  title: 'Learning Type',
};
// Add learning_type to the search facet filters if it doesn't exist in the list yet.
if (
  !SEARCH_FACET_FILTERS.some((filter) => filter.attribute === LEARNING_TYPE_REFINEMENT)
) {
  SEARCH_FACET_FILTERS.push(learningType);
}

const CatalogPage = ({ intl }) => {
  const location = useLocation();
  const config = getConfig();
  // Default routing:
  //   1. If our url on load does not have a catalog parameter set, set one.
  //   2. If our url on load does not have an availability param set, set to available and
  //      upcoming courses.
  // Doing this via Url Params will cause a page reload for visitors coming from the main URL, but
  // it's the only way to keep infinite loops out of the rest of the page and display data that
  // is cohesive with those Url params the rest of the time.
  const loadedSearchParams = new URLSearchParams(location.search);
  let reloadPage = false;
  let hideCards = false;

  // Sometimes an empty query can be appended to the url, which can lead to confusing UX
  if (loadedSearchParams.has('q') && !loadedSearchParams.get('q')) {
    loadedSearchParams.delete('q');
    reloadPage = true;
  }

  // Remove the `learning_type = executive education` filter if the selected
  // catalog isn't `a la carte`
  if (
    (config.EDX_ENTERPRISE_ALACARTE_TITLE
    && !(
      loadedSearchParams.get(QUERY_TITLE_REFINEMENT)
      === config.EDX_ENTERPRISE_ALACARTE_TITLE
    ))
    && loadedSearchParams.get(LEARNING_TYPE_REFINEMENT)
      === EXEC_ED_TITLE
  ) {
    const loadedLearningTypes = loadedSearchParams.getAll(
      LEARNING_TYPE_REFINEMENT,
    );
    if (loadedLearningTypes.length) {
      loadedSearchParams.delete(LEARNING_TYPE_REFINEMENT);
      loadedLearningTypes.forEach((type) => {
        if (type !== EXEC_ED_TITLE) {
          loadedSearchParams.append(LEARNING_TYPE_REFINEMENT, type);
        }
      });
    }

    reloadPage = true;
  }

  // If we don't have specified learning_type(s) and we don't have specified catalog(s) then automatically add
  // the `a la carte` catalog
  if (
    config.EDX_ENTERPRISE_ALACARTE_TITLE
    && !loadedSearchParams.get(QUERY_TITLE_REFINEMENT)
  ) {
    loadedSearchParams.set(
      QUERY_TITLE_REFINEMENT,
      config.EDX_ENTERPRISE_ALACARTE_TITLE,
    );
    reloadPage = true;
  }

  // Ensure we have availability refinement(s) set by default
  if (
    !loadedSearchParams.get(AVAILABILITY_REFINEMENT)
  ) {
    AVAILABILITY_REFINEMENT_DEFAULTS.map((a) => loadedSearchParams.append(AVAILABILITY_REFINEMENT, a));
    reloadPage = true;
  }
  if (reloadPage) {
    window.location.search = loadedSearchParams.toString();
  }
  if (loadedSearchParams.get(HIDE_CARDS_REFINEMENT) === 'true') {
    hideCards = true;
  }

  return (
    <main>
      <Hero
        text={intl.formatMessage(messages['catalogPage.hero.text'])}
        highlight={intl.formatMessage(messages['catalogPage.hero.highlight'])}
      />
      <Subheader>
        <div className="d-flex flex-column text-left">
          <span>
            <FormattedMessage
              id="catalogPage.subtitle.text"
              defaultMessage="edX offers engaging, market-driven course content from over 250 of the top-ranked universities and recognized industry leaders around the world. Our expert team will help you easily create a custom Academy tailored to all your organization’s learning goals, or design your own using the tools below. "
              description="Description of the catalog contents and navigation to other edX pages."
            />
          </span>
        </div>
      </Subheader>
      <SearchData
        trackingName={TRACKING_APP_NAME}
        searchFacetFilters={[
          ...SEARCH_FACET_FILTERS,
          {
            attribute: QUERY_TITLE_REFINEMENT,
            title: 'Catalog Titles',
            noDisplay: true,
          },
        ]}
      >
        <CatalogSelectionDeck
          hide={hideCards}
          title={intl.formatMessage(
            messages['catalogPage.catalogSelectionDeck.title'],
          )}
        />
        <CatalogSearch />
      </SearchData>
    </main>
  );
};

CatalogPage.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CatalogPage);
