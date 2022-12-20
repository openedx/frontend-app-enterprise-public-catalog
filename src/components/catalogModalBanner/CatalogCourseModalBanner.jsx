import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import {
  Book, BookOpen, EventNote, MoneyOutline,
} from '@edx/paragon/icons';
import messages from './CatalogCourseModalBanner.messages';
import {
  checkAvailability,
  checkSubscriptions,
} from '../../utils/catalogUtils';

const nowDate = new Date(Date.now());

function availabilitySubtitle(start, end, upcomingRuns) {
  let retString = '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (startDate < nowDate && endDate > nowDate) {
    retString = `Session ends ${endDate.toLocaleDateString(
      undefined,
      options,
    )}`;
  } else if (startDate > nowDate) {
    retString = `Session starts ${startDate.toLocaleDateString(
      undefined,
      options,
    )}`;
  }
  if (upcomingRuns !== undefined && upcomingRuns > 0) {
    retString += ` • ${upcomingRuns} additional session(s)`;
  }
  return retString;
}

function CatalogCourseModalBanner({
  intl,
  coursePrice,
  courseAssociatedCatalogs,
  startDate,
  endDate,
  upcomingRuns,
  execEd,
}) {
  return (
    <div className="my-4.5 banner">
      <div className="banner-section mx-3">
        <div className="banner h4 mb-0">
          <Icon className="mr-1" src={MoneyOutline} />
          {coursePrice.split('.')[0]}
        </div>
        <div className="banner-subtitle small">
          {intl.formatMessage(
            messages['CatalogCourseModalBanner.bannerPriceText'],
          )}
        </div>
      </div>
      <div className="banner-section slash">/</div>
      {checkSubscriptions(courseAssociatedCatalogs) && !execEd && (
        <>
          <div className="banner-section mx-3">
            <div className="banner h4 mb-0">
              <Icon className="mr-1" src={BookOpen} />
              {intl.formatMessage(
                messages['CatalogCourseModalBanner.bannerCatalogText'],
              )}
            </div>
            <div className="banner-subtitle small">
              {checkSubscriptions(courseAssociatedCatalogs)}
            </div>
          </div>
          <div className="banner-section slash">/</div>
        </>
      )}
      {execEd && (
        <>
          <div className="banner-section mx-3">
            <div className="banner h4 mb-0">
              <Icon className="mr-1" src={Book} />
              {intl.formatMessage(
                messages['CatalogCourseModalBanner.bannerExecEdText'],
              )}
            </div>
            <div className="banner-subtitle small">
              {intl.formatMessage(
                messages['CatalogCourseModalBanner.bannerExecEdSubtext'],
              )}
            </div>
          </div>
          <div className="banner-section slash">/</div>
        </>
      )}
      <div className="banner-section mx-3">
        <div className="banner h4 mb-0">
          <Icon className="mr-1" src={EventNote} />
          {checkAvailability(startDate, endDate)}
        </div>
        <div className="banner-subtitle small">
          {availabilitySubtitle(startDate, endDate, upcomingRuns)}{' '}
        </div>
      </div>
    </div>
  );
}

CatalogCourseModalBanner.defaultProps = {
  coursePrice: '0',
  courseAssociatedCatalogs: [],
  startDate: '',
  endDate: '',
  upcomingRuns: 0,
  execEd: false,
};

CatalogCourseModalBanner.propTypes = {
  intl: intlShape.isRequired,
  coursePrice: PropTypes.string,
  courseAssociatedCatalogs: PropTypes.arrayOf(PropTypes.string),
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  upcomingRuns: PropTypes.number,
  execEd: PropTypes.bool,
};

export default injectIntl(CatalogCourseModalBanner);
