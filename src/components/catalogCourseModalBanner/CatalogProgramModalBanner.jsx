import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
} from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import {
  Assignment,
  MoneyOutline,
} from '@edx/paragon/icons';
import messages from './CatalogCourseModalBanner.messages';
import { checkSubscriptions } from '../../utils/catalogUtils';

const CatalogProgramModalBanner = ({
  intl,
  coursePrice,
  courseAssociatedCatalogs,
  courses,
  subtitle,
}) => (
  <div className="my-4.5 d-flex">
    { (coursePrice !== undefined) && (
    <>
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
    </>
    )}
    { (courses && courses.length > 0) && (
      <>
        <div className="banner-section mx-3">
          <div className="d-flex h4 mb-0">
            <Icon className="mr-1" src={Assignment} />
            {courses.length} courses
          </div>
          <div className="banner-subtitle small">{subtitle}</div>
        </div>
        <div className="banner-section slash">/</div>
      </>
    )}
    {checkSubscriptions(courseAssociatedCatalogs) && (
      <>
        <div className="banner-section mx-3">
          <div className="d-flex h4 mb-0">
            <Icon className="mr-1" src={Assignment} />
            {intl.formatMessage(messages['CatalogCourseModalBanner.bannerCatalogText'])}
          </div>
          <div className="banner-subtitle small">{checkSubscriptions(courseAssociatedCatalogs)}</div>
        </div>
      </>
    )}
  </div>

);

CatalogProgramModalBanner.defaultProps = {
  coursePrice: 0,
  courseAssociatedCatalogs: [],
  courses: [],
  subtitle: '',
};

CatalogProgramModalBanner.propTypes = {
  intl: intlShape.isRequired,
  coursePrice: PropTypes.number,
  courseAssociatedCatalogs: PropTypes.arrayOf(PropTypes.string),
  courses: PropTypes.arrayOf(PropTypes.shape({})),
  subtitle: PropTypes.string,
};

export default injectIntl(CatalogProgramModalBanner);
