/* eslint-disable camelcase */
// variables taken from algolia not in camelcase
import PropTypes from 'prop-types';

import { Badge, Card } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from './CourseCard.messages';
import defaultCardHeader from '../../static/default-card-header-light.png';
import { formatPrice } from '../../utils/common';

const CourseCard = ({ onClick, original }) => {
  const intl = useIntl();
  const {
    title,
    card_image_url,
    partners,
    normalized_metadata,
    enterprise_catalog_query_titles,
    advertised_course_run,
  } = original;
  const priceText = formatPrice(normalized_metadata.content_price);
  let pacingType = 'NA';
  if (advertised_course_run) {
    pacingType = advertised_course_run.pacing_type === 'self_paced' ? 'Self paced' : 'Instructor led';
  }

  const imageSrc = card_image_url || defaultCardHeader;
  const altText = `${title} course image`;

  return (
    <Card
      isClickable
      className="course-card"
      tabIndex="0"
      onClick={() => onClick(original)}
    >
      <Card.ImageCap
        src={imageSrc}
        logoSrc={partners[0]?.logo_image_url}
        srcAlt={altText}
        logoAlt={partners[0]?.name}
      />
      <Card.Header title={title} subtitle={partners[0].name} />
      <span className="cards-spacing" />
      <Card.Section>
        <p className="my-3">
          {priceText} • {pacingType}
        </p>
        <div style={{ maxWidth: '400vw' }}>
          {enterprise_catalog_query_titles?.includes(
            process.env.EDX_ENTERPRISE_ALACARTE_TITLE,
          ) && (
            <Badge variant="dark" className="ml-0 padded-catalog">
              {intl.formatMessage(messages['courseCard.aLaCarteBadge'])}
            </Badge>
          )}
          {enterprise_catalog_query_titles?.includes(
            process.env.EDX_FOR_SUBSCRIPTION_TITLE,
          ) && (
            <Badge
              variant="secondary"
              className="business-catalog padded-catalog"
            >
              {intl.formatMessage(messages['courseCard.subscriptionBadge'])}
            </Badge>
          )}
        </div>
      </Card.Section>
    </Card>
  );
};

CourseCard.defaultProps = {
  onClick: () => {},
};

CourseCard.propTypes = {
  onClick: PropTypes.func,
  original: PropTypes.shape({
    title: PropTypes.string,
    card_image_url: PropTypes.string,
    entitlements: PropTypes.arrayOf(PropTypes.shape()),
    advertised_course_run: PropTypes.shape(),
    partners: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        logo_image_url: PropTypes.string,
      }),
    ),
    normalized_metadata: PropTypes.shape({
      content_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    first_enrollable_paid_seat_price: PropTypes.number,
    enterprise_catalog_query_titles: PropTypes.arrayOf(PropTypes.string),
    original_image_url: PropTypes.string,
  }).isRequired,
};

export default CourseCard;
