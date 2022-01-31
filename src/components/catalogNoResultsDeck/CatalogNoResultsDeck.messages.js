import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'catalogSearchResults.DefaultCourseDeckTitle': {
    id: 'catalogSearchResults.popularCourses',
    defaultMessage: 'Popular Courses',
    description: 'Popular Courses table header.',
  },
  'catalogSearchResults.DefaultProgramDeckTitle': {
    id: 'catalogSearchResults.popularPrograms',
    defaultMessage: 'Popular Programs',
    description: 'Popular Programs table header.',
  },
  'catalogSearchResults.NoResultsBannerTitle': {
    id: 'catalogSearchResults.NoResultsBannerTitle',
    defaultMessage: 'No Results',
    description: 'No results alert modal header.',
  },
  'catalogSearchResults.NoResultsCourseBannerText': {
    id: 'catalogSearchResults.NoResultsCourseBannerText',
    defaultMessage: 'No courses were found that match your search. Try ',
    description: 'No results course alert modal text.',
  },
  'catalogSearchResults.NoResultsProgramBannerText': {
    id: 'catalogSearchResults.NoResultsProgramBannerText',
    defaultMessage: 'No programs were found that match your search. Try ',
    description: 'No results programs alert modal text.',
  },
  'catalogSearchResults.NoResultsBannerHyperlinkText': {
    id: 'catalogSearchResults.NoResultsBannerHyperlinkText',
    defaultMessage: 'removing filters',
    description: 'No results alert modal hyperlink text.',
  },
});

export default messages;
