import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionRow,
  Badge,
  Button,
  Hyperlink,
  Image,
  ModalDialog,
  Icon,
} from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { Launch } from '@edx/paragon/icons';
import messages from './CatalogCourseInfoModal.messages';

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
        <ModalDialog.Hero className="course-info-hero">
          <ModalDialog.Hero.Background backgroundSrc={bannerImageUrl} />
        </ModalDialog.Hero>

        <ModalDialog.Header className="course-info-modal-header">

          <Image className="mr-2 partner-logo-thumbnail" src={partnerLogoImageUrl} rounded />

          <ModalDialog.Title as="h1" className="course-info-title">
            {courseTitle}
          </ModalDialog.Title>
          <ModalDialog.Title as="h6" className="course-info-partner">
            {courseProvider}
          </ModalDialog.Title>

          <div className="pricing-data-header">
            <ModalDialog.Title className="pricing-data-title">
              {intl.formatMessage(messages['catalogCourseInfoModal.pricingTitle'])}
            </ModalDialog.Title>
            <ModalDialog.Title className="pricing-data-price">
              {coursePrice}
            </ModalDialog.Title>
          </div>
        </ModalDialog.Header>

        <ModalDialog.Body>
          <div className="course-info-associated-catalog-header">
            <ModalDialog.Title className="associated-catalogs-text">
              {intl.formatMessage(messages['catalogCourseInfoModal.associatedCatalogsTitle'])}
            </ModalDialog.Title>
            <Badge className="padded-catalog" variant="dark">
              {intl.formatMessage(messages['catalogCourseInfoModal.aLaCarteBadge'])}
            </Badge>
            { courseAssociatedCatalogs.includes(process.env.EDX_FOR_BUSINESS_UUID) && (
              <Badge className="business-catalog padded-catalog" variant="secondary">
                {intl.formatMessage(messages['catalogCourseInfoModal.businessBadge'])}
              </Badge>
            )}
            { courseAssociatedCatalogs.includes(process.env.EDX_FOR_ONLINE_EDU_UUID) && (
              <Badge className="padded-catalog" variant="light">
                {intl.formatMessage(messages['catalogCourseInfoModal.educationBadge'])}
              </Badge>
            )}
          </div>
          <p className="course-info-description-title">
            {intl.formatMessage(messages['catalogCourseInfoModal.courseDescriptionTitle'])}
          </p>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: courseDescription }} />
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
};

export default injectIntl(CatalogCourseInfoModal);
