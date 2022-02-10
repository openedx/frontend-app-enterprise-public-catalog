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
import CatalogProgramModalBanner from '../catalogCourseModalBanner/CatalogProgramModalBanner';

const SkillsListing = ({ skillNames }) => (
  <ul className="mx-2 course-info-skills-list">
    {skillNames.slice(0, 5).map(s => <li key={`skill-name-${s}`}>{s}</li>)}
  </ul>
);

SkillsListing.propTypes = {
  skillNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const CourseModal = ({
  intl, isOpen, onClose, selectedCourse,
}) => {
  const {
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
    skillNames,
  } = selectedCourse;

  return (
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
          <ModalDialog.Body className="full-body p-0">
            <ModalDialog.Hero>
              <ModalDialog.Hero.Background className="course-info-hero" backgroundSrc={bannerImageUrl} />
            </ModalDialog.Hero>
            <Image className="mr-2 partner-logo-thumbnail" src={partnerLogoImageUrl} rounded />
            <div className="padded-body">
              <ModalDialog.Title className="h1 course-info-title">
                {courseTitle}
              </ModalDialog.Title>
              <ModalDialog.Title className="h2 course-info-partner">
                {courseProvider}
              </ModalDialog.Title>
              <CatalogCourseModalBanner
                coursePrice={coursePrice}
                courseAssociatedCatalogs={courseAssociatedCatalogs}
                startDate={startDate}
                endDate={endDate}
                upcomingRuns={upcomingRuns}
              />
              <p className="h3">
                {intl.formatMessage(messages['catalogCourseInfoModal.courseDescriptionTitle'])}
              </p>
              {/* eslint-disable-next-line react/no-danger */}
              <div dangerouslySetInnerHTML={{ __html: courseDescription }} />
              {(skillNames && skillNames.length > 0) && (
              <div className="course-info-skills px-2 py-1">
                <h4 className="mx-2 my-3">
                  {intl.formatMessage(messages['catalogCourseInfoModal.relatedSkillsHeading'])}
                </h4>
                <SkillsListing skillNames={skillNames} />
              </div>
              )}
            </div>
          </ModalDialog.Body>

          <ModalDialog.Footer>
            <ActionRow>
              {marketingUrl && (
              <Hyperlink
                showLaunchIcon={false}
                variant="muted"
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
              )}
              <ModalDialog.CloseButton className="course-info-footer-button" variant="dark">
                {intl.formatMessage(messages['catalogCourseInfoModal.closeButton'])}
              </ModalDialog.CloseButton>
            </ActionRow>
          </ModalDialog.Footer>
        </ModalDialog>
      </div>
    </>
  );
};

CourseModal.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedCourse: PropTypes.shape({
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
    skillNames: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

const CourseDisplayForProgram = ({ course }) => {
  const { image, title, short_description: desc } = course;
  return (
    <div className="d-flex">
      <div className="mr-2">
        <Image className="mr-2 course-info-modal-course-thumbnail" src={image} rounded />
      </div>
      <div className="ml-1 mr-1">
        <h3>{title}</h3>
        <p>
          {desc}
        </p>
      </div>
    </div>
  );
};

CourseDisplayForProgram.propTypes = {
  course: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    short_description: PropTypes.string,
  }).isRequired,
};

const ProgramModal = ({
  intl, isOpen, onClose, selectedProgram,
}) => {
  const {
    programTitle,
    programProvider,
    programDescription,
    programAssociatedCatalogs,
    partnerLogoImageUrl,
    marketingUrl,
    learningItems,
    programPrices,
    bannerImageUrl,
    programCourses,
  } = selectedProgram;

  const prices = programPrices?.filter(item => item.currency === 'USD');
  const usdPrice = prices && prices.length > 0 ? prices[0].total : 0;

  const bulletedList = items => {
    if (!items) { return <></>; }
    const itemsList = items.map(item => <li key={item}>{item}</li>);
    return <ul>{itemsList}</ul>;
  };
  return (
    <>
      <div>
        <ModalDialog
          title="Program Info Dialog"
          isOpen={isOpen}
          onClose={onClose}
          size="xl"
          hasCloseButton
          isFullscreenOnMobile
          className="course-info-modal"
        >
          <ModalDialog.Body className="full-body p-0">
            <ModalDialog.Hero>
              <ModalDialog.Hero.Background className="course-info-hero" backgroundSrc={bannerImageUrl} />
            </ModalDialog.Hero>
            <Image className="mr-2 partner-logo-thumbnail" src={partnerLogoImageUrl} rounded />
            <div className="padded-body">
              <ModalDialog.Title className="h1 course-info-title">
                {programTitle}
              </ModalDialog.Title>
              <ModalDialog.Title className="h2 course-info-partner">
                {programProvider}
              </ModalDialog.Title>
              <CatalogProgramModalBanner
                coursePrice={usdPrice}
                courseAssociatedCatalogs={programAssociatedCatalogs}
                courses={programCourses}
              />
              {(learningItems && learningItems.length > 0) && (
              <div className="mt-8">
                <h3>{intl.formatMessage(messages['catalogCourseInfoModal.programLearningItemsHeader'])}</h3>
                {bulletedList(learningItems)}
              </div>
              )}
              {(programCourses && programCourses.length > 0) && (
              <div className="mt-8">
                <h3>{intl.formatMessage(messages['catalogCourseInfoModal.programCourseListingTitle'])}</h3>
                <div className="mt-4">{(programCourses || []).map(course => <CourseDisplayForProgram key={course.courseKey} course={course} />)}</div>
              </div>
              )}

              {/* eslint-disable-next-line react/no-danger */}
              <div dangerouslySetInnerHTML={{ __html: programDescription }} />
            </div>
          </ModalDialog.Body>

          <ModalDialog.Footer>
            <ActionRow>
              <Hyperlink
                showLaunchIcon={false}
                variant="muted"
                destination={marketingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="course-info-footer-button" variant="outline-primary">
                  {intl.formatMessage(messages['catalogCourseInfoModal.programMoreInfoButton'])}
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
};

ProgramModal.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedProgram: PropTypes.shape({
    programTitle: PropTypes.string,
    programDescription: PropTypes.string,
    programProvider: PropTypes.string,
    bannerImageUrl: PropTypes.string,
    programAssociatedCatalogs: PropTypes.arrayOf(PropTypes.string),
    partnerLogoImageUrl: PropTypes.string,
    marketingUrl: PropTypes.string,
    learningItems: PropTypes.arrayOf(PropTypes.string),
    programPrices: PropTypes.arrayOf(PropTypes.shape({})),
    programCourses: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

const CatalogCourseInfoModal = ({
  intl,
  isOpen,
  onClose,
  selectedCourse,
  selectedProgram,
  renderProgram,
}) => {
  if (!selectedCourse && !renderProgram) { return null; }
  if (!selectedProgram && renderProgram) { return null; }
  if (!renderProgram) {
    return <CourseModal selectedCourse={selectedCourse} intl={intl} isOpen={isOpen} onClose={onClose} />;
  }

  return <ProgramModal selectedProgram={selectedProgram} intl={intl} isOpen={isOpen} onClose={onClose} />;
};

CatalogCourseInfoModal.defaultProps = {
  isOpen: false,
  renderProgram: false,
  selectedCourse: {},
  selectedProgram: {},
  onClose: () => {},
};

CatalogCourseInfoModal.propTypes = {
  renderProgram: PropTypes.bool,
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  selectedCourse: PropTypes.shape({
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
    skillNames: PropTypes.arrayOf(PropTypes.string),
  }),
  selectedProgram: PropTypes.shape({
    programTitle: PropTypes.string,
    programDescription: PropTypes.string,
    programProvider: PropTypes.string,
    bannerImageUrl: PropTypes.string,
    programAssociatedCatalogs: PropTypes.arrayOf(PropTypes.string),
    partnerLogoImageUrl: PropTypes.string,
    marketingUrl: PropTypes.string,
    learningItems: PropTypes.arrayOf(PropTypes.string),
    programPrices: PropTypes.arrayOf(PropTypes.shape({})),
    programCourses: PropTypes.arrayOf(PropTypes.shape({})),
  }),
};

export default injectIntl(CatalogCourseInfoModal);
