import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'catalogSearchResults.table.courseName': {
    id: 'catalogSearchResults.table.courseName',
    defaultMessage: 'Course name',
    description: 'Table column title for course names',
  },
  'catalogSearchResults.table.partner': {
    id: 'catalogSearchResults.table.partner',
    defaultMessage: 'Partner',
    description: 'The partner institution providing/authoring the course (ie Harvard, MIT, etc.)',
  },
  'catalogSearchResults.table.price': {
    id: 'catalogSearchResults.table.price',
    defaultMessage: 'A la carte course price',
    description: 'Table column A La Carte price for the course - optional column',
  },
  'catalogSearchResults.table.availability': {
    id: 'catalogSearchResults.table.availability',
    defaultMessage: 'Course Availability',
    description: 'Table column form course availability dates - optional column',
  },
  'catalogSearchResults.table.catalogs': {
    id: 'catalogSearchResults.table.catalogs',
    defaultMessage: 'Associated catalogs',
    description: 'Table column title for associated subscription catalogs',
  },
  'catalogSearchResult.table.priceNotAvailable': {
    id: 'catalogSearchResults.table.priceNotAvailable',
    defaultMessage: ' Not Available',
    description: 'When a course price is not available, notify learners that there is no data available to display.',
  },
  'catalogSearchResults.aLaCarteBadge': {
    id: 'catalogSearchResults.aLaCarteBadge',
    defaultMessage: 'A la carte',
    description: 'Badge text for the `A La Carte` catalog badge.',
  },
  'catalogSearchResults.businessBadge': {
    id: 'catalogSearchResults.businessBadge',
    defaultMessage: 'Business',
    description: 'Badge text for the `Business` catalog badge.',
  },
  'catalogSearchResults.educationBadge': {
    id: 'catalogSearchResults.educationBadge',
    defaultMessage: 'Education',
    description: 'Badge text for the `Education` catalog badge.',
  },
});

export default messages;
