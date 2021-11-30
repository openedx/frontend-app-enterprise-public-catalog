import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionRow,
  Button,
  Hyperlink,
  Image,
  ModalDialog,
  Icon,
} from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { Launch } from '@edx/paragon/icons';
import messages from './CatalogCourseInfoModal.messages';
import CatalogCourseModalBanner from '../catalogCourseModalBanner/CatalogCourseModalBanner';

const CatalogCourseInfoModal = ({
  intl,
  isOpen,
  onClose,
  courseTitle,
  courseProvider,
  coursePrice,
  courseAssociatedCatalogs,
  courseDescription,
  partnerLogoImageUrl,
  bannerImageUrl,
  marketingUrl,
  startDate,
  endDate,
  upcomingRuns,
}) => (

  <>
    <div>
      <ModalDialog
        title="Course Info Dialog"
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        hasCloseButton
        isFullscreenOnMobile
        className="course-info-modal"
      >
        <ModalDialog.Body className="full-body">
          <ModalDialog.Hero>
            <ModalDialog.Hero.Background className="course-info-hero" backgroundSrc={bannerImageUrl} />
          </ModalDialog.Hero>
          <Image className="mr-2 partner-logo-thumbnail" src={partnerLogoImageUrl} rounded />
          <div className="padded-body">
            <ModalDialog.Title as="h1" className="course-info-title">
              {courseTitle}
            </ModalDialog.Title>
            <ModalDialog.Title as="h6" className="course-info-partner">
              {courseProvider}
            </ModalDialog.Title>
            <CatalogCourseModalBanner
              coursePrice={coursePrice}
              courseAssociatedCatalogs={courseAssociatedCatalogs}
              startDate={startDate}
              endDate={endDate}
              upcomingRuns={upcomingRuns}
            />
            <p className="course-info-description-title">
              {intl.formatMessage(messages['catalogCourseInfoModal.courseDescriptionTitle'])}
            </p>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: courseDescription }} />
          </div>
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <ActionRow>
            <Hyperlink
              showLaunchIcon={false}
              varient="muted"
              destination={marketingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="course-info-footer-button" variant="outline-primary">
                {intl.formatMessage(messages['catalogCourseInfoModal.moreInfoButton'])}
                {/* Paragon Button's `iconAfter` throws errors so the icon is manually added */}
                <Icon className="btn-icon-after" src={Launch} />
              </Button>
            </Hyperlink>
            <ModalDialog.CloseButton className="course-info-footer-button" variant="dark">
              {intl.formatMessage(messages['catalogCourseInfoModal.closeButton'])}
            </ModalDialog.CloseButton>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </div>
  </>
);

CatalogCourseInfoModal.defaultProps = {
  isOpen: false,
  courseAssociatedCatalogs: [],
  courseTitle: '',
  courseProvider: '',
  coursePrice: '0',
  courseDescription: '',
  partnerLogoImageUrl: '',
  bannerImageUrl: '',
  marketingUrl: '',
  startDate: '',
  endDate: '',
  upcomingRuns: 0,
  onClose: () => {},
};

CatalogCourseInfoModal.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  courseTitle: PropTypes.string,
  courseProvider: PropTypes.string,
  coursePrice: PropTypes.string,
  courseAssociatedCatalogs: PropTypes.arrayOf(PropTypes.string),
  courseDescription: PropTypes.string,
  partnerLogoImageUrl: PropTypes.string,
  bannerImageUrl: PropTypes.string,
  marketingUrl: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  upcomingRuns: PropTypes.number,
};

export default injectIntl(CatalogCourseInfoModal);
