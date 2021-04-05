import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'catalogSearchResults.table.courseName': {
    id: 'catalogSearchResults.table.courseName',
    defaultMessage: 'Course name',
    description: 'Table column title for course names',
  },
  'catalogSearchResults.table.subject': {
    id: 'catalogSearchResults.table.subject',
    defaultMessage: 'Subject',
    description: 'Table column title for course subjects',
  },
  'catalogSearchResults.table.partner': {
    id: 'catalogSearchResults.table.partner',
    defaultMessage: 'Partner',
    description: 'The partner institution providing/authoring the course (ie Harvard, MIT, etc.)',
  },
});

export default messages;
