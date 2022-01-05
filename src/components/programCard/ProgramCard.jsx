/* eslint-disable camelcase */
// variables taken from algolia not in camelcase
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  Badge,
  Image,
  Icon,
  Card,
} from '@edx/paragon';
import { Program } from '@edx/paragon/icons';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './ProgramCard.messages';

function makePlural(num, string) {
  if (num > 1) { return (`${num} ${string}s`); }
  return (`${num} ${string}`);
}

const ProgramCard = ({
  intl, onClick, className, original,
}) => {
  const {
    title,
    card_image_url,
    course_keys,
    partners,
    enterprise_catalog_query_titles,
    program_type,
  } = original;
  return (
    <Card className={className} tabIndex="0" onClick={() => onClick(original)}>
      <Card.Img
        className="cards-course-image"
        variant="top"
        src={card_image_url}
        alt={title}
      />
      {(partners.length !== 0) && <Image className="mr-2 cards-partner-logo" src={partners[0].logo_image_url} rounded />}
      <div className="cards-title">
        <p className="program-title">{title}</p>
        {(partners.length !== 0) && <p className="small">{ partners[0].name }</p>}
      </div>
      <span className="cards-spacing" />

      <div className="cards-body">
        <div className="d-flex">
          <Badge
            variant="light"
            className={classNames(
              'program d-flex justify-content-center align-items-center text-primary-500', 'mb-2',
            )}
          >
            <Icon src={Program} className="badge-icon" />
            <span className="badge-text"> {program_type} </span>
          </Badge>
        </div>
        <p className="x-small mb-2 mt-2">{makePlural(course_keys.length, 'Course')}</p>
        {enterprise_catalog_query_titles && (
        <div style={{ maxWidth: '400vw' }}>
          {
              enterprise_catalog_query_titles.includes(process.env.EDX_ENTERPRISE_ALACARTE_TITLE)
                && <Badge variant="info" className="ml-0 bright padded-catalog">{intl.formatMessage(messages['ProgramCard.aLaCarteBadge'])}</Badge>
            }
          {
              enterprise_catalog_query_titles.includes(process.env.EDX_FOR_BUSINESS_TITLE)
                && <Badge variant="secondary" className="padded-catalog">{intl.formatMessage(messages['ProgramCard.businessBadge'])}</Badge>
            }
          {
              enterprise_catalog_query_titles.includes(process.env.EDX_FOR_ONLINE_EDU_TITLE)
                && (
                <Badge className="padded-catalog" variant="light">
                  {intl.formatMessage(messages['ProgramCard.educationBadge'])}
                </Badge>
                )
            }
        </div>
        )}
      </div>
    </Card>
  );
};

ProgramCard.defaultProps = {
  className: '',
  onClick: () => {},
};

ProgramCard.propTypes = {
  intl: intlShape.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  original: PropTypes.shape({
    title: PropTypes.string,
    card_image_url: PropTypes.string,
    course_keys: PropTypes.arrayOf(PropTypes.string),
    partners: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, logo_image_url: PropTypes.string })),
    enterprise_catalog_query_titles: PropTypes.arrayOf(PropTypes.string),
    program_type: PropTypes.string,
  }).isRequired,
};

export default injectIntl(ProgramCard);
