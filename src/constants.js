/* eslint-disable import/prefer-default-export */
import { SEARCH_FACET_FILTERS } from '@edx/frontend-enterprise-catalog-search';
import features from './config';

export const PAGE_TITLE = 'edX Enterprise Catalogs';

/**
 * Event names to use for tracking
 * Spec: https://openedx.atlassian.net/wiki/spaces/AN/pages/2624455676/Enterprise+public+catalog+Event+Design
 */
export const TRACKING_APP_NAME = 'explore-catalog';
// end: tracking related
export const QUERY_TITLE_REFINEMENT = 'enterprise_catalog_query_titles';
export const AVAILABILITY_REFINEMENT = 'availability';
export const AVAILABILITY_REFINEMENT_DEFAULTS = ['Available Now', 'Upcoming'];
export const CONTENT_TYPE_REFINEMENT = 'content_type';
export const HIDE_CARDS_REFINEMENT = 'hide_cards';
export const HIDE_PRICE_REFINEMENT = 'hide_price';
export const NUM_RESULTS_PER_PAGE = 40;
export const CONTENT_TYPE_COURSE = 'course';
export const CONTENT_TYPE_PROGRAM = 'program';
export const NUM_RESULTS_PROGRAM = 4;
export const NUM_RESULTS_COURSE = 8;
export const COURSE_TITLE = 'Courses';
export const PROGRAM_TITLE = 'Programs';

const OVERRIDE_FACET_FILTERS = [];
if (features.PROGRAM_TYPE_FACET) {
  const PROGRAM_TYPE_FACET_OVERRIDE = {
    overrideSearchKey: 'title',
    overrideSearchValue: 'Program',
    updatedFacetFilterValue: {
      attribute: 'program_type',
      title: 'Program',
      isSortedAlphabetical: true,
      typeaheadOptions: {
        placeholder: 'Find a program...',
        ariaLabel: 'Type to find a program',
        minLength: 3,
      },
    },
  };
  OVERRIDE_FACET_FILTERS.push(PROGRAM_TYPE_FACET_OVERRIDE);
}

OVERRIDE_FACET_FILTERS.forEach(({ overrideSearchKey, overrideSearchValue, updatedFacetFilterValue }) => {
  SEARCH_FACET_FILTERS.find((facetFilter, index) => {
    if (facetFilter[overrideSearchKey] === overrideSearchValue) {
      SEARCH_FACET_FILTERS[index] = updatedFacetFilterValue;
      return true;
    }
    return false;
  });
});

export { SEARCH_FACET_FILTERS };
