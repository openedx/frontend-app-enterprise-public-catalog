import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
} from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import {
  BookOpen,
  EventNote,
  MoneyOutline,
} from '@edx/paragon/icons';
import messages from './CatalogCourseModalBanner.messages';
import { checkAvailability, checkSubscriptions } from '../../utils/catalogUtils';

const nowDate = new Date(Date.now());

function availabilitySubtitle(start, end, upcomingRuns) {
  let retString = '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (startDate < nowDate && endDate > nowDate) {
    retString = `Session ends ${endDate.toLocaleDateString(undefined, options)}`;
  } else if (startDate > nowDate) {
    retString = `Session starts ${startDate.toLocaleDateString(undefined, options)}`;
  }
  if (upcomingRuns !== undefined && upcomingRuns > 0) {
    retString += ` • ${upcomingRuns} additional session(s)`;
  }
  return retString;
}

const CatalogCourseModalBanner = ({
  intl,
  coursePrice,
  courseAssociatedCatalogs,
  startDate,
  endDate,
  upcomingRuns,
}) => (
  <div className="my-4.5 d-flex">
    <div className="banner-section mx-3">
      <div className="d-flex h4 mb-0">
        <Icon className="mr-1" src={MoneyOutline} />
        {coursePrice}
      </div>
      <div className="banner-subtitle small">
        {intl.formatMessage(messages['CatalogCourseModalBanner.bannerPriceText'])}
      </div>

    </div>
    <div className="banner-section slash">/</div>
    {checkSubscriptions(courseAssociatedCatalogs) && (
      <div className="banner-section mx-3">
        <div className="d-flex h4 mb-0">
          <Icon className="mr-1" src={BookOpen} />
          {intl.formatMessage(messages['CatalogCourseModalBanner.bannerCatalogText'])}
        </div>
        <div className="banner-subtitle small">{checkSubscriptions(courseAssociatedCatalogs)}</div>
      </div>
    )}
    {checkSubscriptions(courseAssociatedCatalogs) && (
      <div className="banner-section slash">/</div>
    )}
    <div className="banner-section mx-3">
      <div className="d-flex h4 mb-0">
        <Icon className="mr-1" src={EventNote} />
        {checkAvailability(startDate, endDate)}
      </div>
      <div className="banner-subtitle small">{availabilitySubtitle(startDate, endDate, upcomingRuns)} </div>
    </div>
  </div>

);

CatalogCourseModalBanner.defaultProps = {
  coursePrice: '0',
  courseAssociatedCatalogs: [],
  startDate: '',
  endDate: '',
  upcomingRuns: 0,
};

CatalogCourseModalBanner.propTypes = {
  intl: intlShape.isRequired,
  coursePrice: PropTypes.string,
  courseAssociatedCatalogs: PropTypes.arrayOf(PropTypes.string),
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  upcomingRuns: PropTypes.number,
};

export default injectIntl(CatalogCourseModalBanner);
