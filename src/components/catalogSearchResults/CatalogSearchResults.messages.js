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
    description: 'Table column A La Carte price for the course',
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
});

export default messages;
