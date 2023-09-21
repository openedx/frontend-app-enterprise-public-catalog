import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'ProgramCard.relatedSkillsHeading': {
    id: 'ProgramCard.relatedSkillsHeading',
    defaultMessage: 'Related skills',
    description: 'Heading of related skills section',
  },
  'ProgramCard.aLaCarteBadge': {
    id: 'ProgramCard.aLaCarteBadge',
    defaultMessage: 'A la carte',
    description: 'Badge text for the `A La Carte` catalog badge.',
  },
  'ProgramCard.businessBadge': {
    id: 'ProgramCard.businessBadge',
    defaultMessage: 'Business',
    description: 'Badge text for the `Business` catalog badge.',
  },
  'ProgramCard.educationBadge': {
    id: 'ProgramCard.educationBadge',
    defaultMessage: 'Education',
    description: 'Badge text for the `Education` catalog badge.',
  },
  'ProgramCard.priceNotAvailable': {
    id: 'ProgramCard.priceNotAvailable',
    defaultMessage: ' Not Available',
    description:
      'When a course price is not available, notify learners that there is no data available to display.',
  },
});

export default messages;
