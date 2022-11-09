import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { Assignment, BookOpen, MoneyOutline } from '@edx/paragon/icons';
import messages from './CatalogCourseModalBanner.messages';
import { checkSubscriptions } from '../../utils/catalogUtils';

const CatalogProgramModalBanner = ({
  intl,
  coursePrice,
  courseAssociatedCatalogs,
  courses,
}) => (
  <div className="my-4.5 banner">
    {coursePrice !== undefined && (
    <>
      <div className="banner-section mx-3">
        <div className="banner h4 mb-0">
          <Icon className="mr-1" src={MoneyOutline} />
          {coursePrice}
        </div>
        <div className="banner-subtitle small">
          {intl.formatMessage(
            messages['CatalogCourseModalBanner.bannerPriceTextProgram'],
          )}
        </div>
      </div>
      <div className="banner-section slash">/</div>
    </>
    )}
    {courses && courses.length > 0 && (
    <>
      <div className="banner-section mx-3">
        <div className="banner h4 mb-0">
          <Icon className="mr-1" src={Assignment} />
          {courses.length} courses
        </div>
        <div className="banner-subtitle small">
          {intl.formatMessage(
            messages['CatalogCourseModalBanner.bannerCourseText'],
          )}
        </div>
      </div>
      <div className="banner-section slash">/</div>
    </>
    )}
    {checkSubscriptions(courseAssociatedCatalogs) && (
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
    )}
  </div>
);

CatalogProgramModalBanner.defaultProps = {
  coursePrice: '$0',
  courseAssociatedCatalogs: [],
  courses: [],
};

CatalogProgramModalBanner.propTypes = {
  intl: intlShape.isRequired,
  coursePrice: PropTypes.string,
  courseAssociatedCatalogs: PropTypes.arrayOf(PropTypes.string),
  courses: PropTypes.arrayOf(PropTypes.shape({})),
};

export default injectIntl(CatalogProgramModalBanner);
