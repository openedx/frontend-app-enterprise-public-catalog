import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'programCard.relatedSkillsHeading': {
    id: 'programCard.relatedSkillsHeading',
    defaultMessage: 'Related skills',
    description: 'Heading of related skills section',
  },
  'programCard.aLaCarteBadge': {
    id: 'programCard.aLaCarteBadge',
    defaultMessage: 'A la carte',
    description: 'Badge text for the `A La Carte` catalog badge.',
  },
  'programCard.businessBadge': {
    id: 'programCard.businessBadge',
    defaultMessage: 'Business',
    description: 'Badge text for the `Business` catalog badge.',
  },
  'programCard.educationBadge': {
    id: 'programCard.educationBadge',
    defaultMessage: 'Education',
    description: 'Badge text for the `Education` catalog badge.',
  },
  'programCard.priceNotAvailable': {
    id: 'programCard.priceNotAvailable',
    defaultMessage: ' Not Available',
    description: 'When a course price is not available, notify learners that there is no data available to display.',
  },
});

export default messages;
