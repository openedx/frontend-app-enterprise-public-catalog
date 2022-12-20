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
export const AVAILABILITY_REFINEMENT_DEFAULTS = [
  'Available Now',
  'Starting Soon',
  'Upcoming',
];

export const CONTENT_TYPE_REFINEMENT = 'content_type';
export const COURSE_TYPE_REFINEMENT = 'course_type';
export const LEARNING_TYPE_REFINEMENT = 'learning_type';
export const HIDE_CARDS_REFINEMENT = 'hide_cards';
export const HIDE_PRICE_REFINEMENT = 'hide_price';
export const NUM_RESULTS_PER_PAGE = 40;
export const CONTENT_TYPE_COURSE = 'course';
export const CONTENT_TYPE_PROGRAM = 'program';
export const NUM_RESULTS_PROGRAM = 4;
export const NUM_RESULTS_COURSE = 8;
export const COURSE_TITLE = 'Courses';
export const PROGRAM_TITLE = 'Programs';
export const EXEC_ED_TITLE = 'Executive Education';
export const NO_RESULTS_DECK_ITEM_COUNT = 4;
export const NO_RESULTS_PAGE_ITEM_COUNT = 1;
export const NO_RESULTS_PAGE_SIZE = 4;
const AUDIT_COURSE_TYPE = 'audit';
const VERIFIED_AUDIT_COURSE_TYPE = 'verified-audit';
const PROFESSIONAL_COURSE_TYPE = 'professional';
const CREDIT_VERIFIED_AUDIT_COURSE_TYPE = 'credit-verified-audit';
export const EXECUTIVE_EDUCATION_2U_COURSE_TYPE = 'executive-education-2u';
export const EDX_COURSES_COURSE_TYPES = [
  AUDIT_COURSE_TYPE,
  VERIFIED_AUDIT_COURSE_TYPE,
  PROFESSIONAL_COURSE_TYPE,
  CREDIT_VERIFIED_AUDIT_COURSE_TYPE,
];

export const EDX_COURSE_TITLE_DESC = 'Self paced online learning from world-class academic institutions and corporate partners.';
export const TWOU_EXEC_ED_TITLE_DESC = 'Immersive, instructor led online short courses designed to develop interpersonal, analytical, and critical thinking skills.';
export const PROGRAM_TITLE_DESC = 'Multi-course bundled learning for skills mastery and to earn credentials such as Professional Certificates, MicroBachelors™, MicroMasters®, and Master’s Degrees.';

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

OVERRIDE_FACET_FILTERS.forEach(
  ({ overrideSearchKey, overrideSearchValue, updatedFacetFilterValue }) => {
    SEARCH_FACET_FILTERS.find((facetFilter, index) => {
      if (facetFilter[overrideSearchKey] === overrideSearchValue) {
        SEARCH_FACET_FILTERS[index] = updatedFacetFilterValue;
        return true;
      }
      return false;
    });
  },
);

export { SEARCH_FACET_FILTERS };
