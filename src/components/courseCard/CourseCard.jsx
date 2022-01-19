/* eslint-disable camelcase */
// variables taken from algolia not in camelcase
import React from 'react';
import PropTypes from 'prop-types';

import {
  Badge,
  Image,
  Card,
} from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './CourseCard.messages';

const CourseCard = ({
  intl, onClick, className, original,
}) => {
  const {
    title,
    card_image_url,
    partners,
    first_enrollable_paid_seat_price,
    enterprise_catalog_query_titles,
    availability,
  } = original;
  const rowPrice = first_enrollable_paid_seat_price;
  const priceText = (rowPrice != null) ? `$${rowPrice.toString()}` : 'N/A';
  return (
    <Card className={className} tabIndex="0" onClick={() => onClick(original)}>
      <Card.Img
        className="cards-course-image"
        variant="top"
        src={card_image_url}
        alt={title}
      />
      <Image className="mr-2 cards-partner-logo" src={partners[0].logo_image_url} rounded />
      <div className="mx-3 my-4">
        <p className="h4">{title}</p>
        <p className="small">{ partners[0].name }</p>
      </div>
      <span className="cards-spacing" />
      <div className="mx-3 my-4">
        <p className="x-small mb-3">{ priceText } • {availability[0]}</p>
        <div style={{ maxWidth: '400vw' }}>
          {
              enterprise_catalog_query_titles.includes(process.env.EDX_ENTERPRISE_ALACARTE_TITLE)
                && <Badge variant="dark" className="ml-0 padded-catalog">{intl.formatMessage(messages['courseCard.aLaCarteBadge'])}</Badge>
            }
          {
              enterprise_catalog_query_titles.includes(process.env.EDX_FOR_BUSINESS_TITLE)
                && <Badge variant="secondary" className="business-catalog padded-catalog">{intl.formatMessage(messages['courseCard.businessBadge'])}</Badge>
            }
          {
              enterprise_catalog_query_titles.includes(process.env.EDX_FOR_ONLINE_EDU_TITLE)
                && (
                <Badge className="padded-catalog" variant="light">
                  {intl.formatMessage(messages['courseCard.educationBadge'])}
                </Badge>
                )
            }
        </div>
      </div>
    </Card>
  );
};

CourseCard.defaultProps = {
  className: '',
  onClick: () => {},
};

CourseCard.propTypes = {
  intl: intlShape.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  original: PropTypes.shape({
    title: PropTypes.string,
    card_image_url: PropTypes.string,
    partners: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, logo_image_url: PropTypes.string })),
    first_enrollable_paid_seat_price: PropTypes.number,
    enterprise_catalog_query_titles: PropTypes.arrayOf(PropTypes.string),
    original_image_url: PropTypes.string,
    availability: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default injectIntl(CourseCard);
