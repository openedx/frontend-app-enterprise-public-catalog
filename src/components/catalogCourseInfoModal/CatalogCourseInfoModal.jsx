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
              {(skillNames.length > 0) && (
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

const ProgramModal = ({
  intl, isOpen, onClose, selectedProgram,
}) => {
  /**
   * aggregation_key: "program:3cd8108c-a881-47fd-84ae-74d82ccc38a8"
authoring_organizations: [{uuid: "4f8cb2c9-589b-4d1e-88c1-b01a02db3a9c", key: "edx", name: "edX",…}]
availability: ["Archived"]
content_type: "program"
course_keys: ["edx+H100", "edx+H200"]
enterprise_catalog_query_titles: ["A la carte", "string"]
enterprise_catalog_query_uuids: ["067c8c2f-e3fc-45ea-aaf9-52aed5f103b4", "09d4d0b3-55d9-49ce-809e-aba6f7c95dab",…]
language: ["English"]
level_type: "Introductory"
marketing_url: "https://stage.edx.org/xseries/happiness-program"
objectID: "program-3cd8108c-a881-47fd-84ae-74d82ccc38a8-catalog-query-uuids-0"
partner: "edx"
partners: [{name: "edX",…}]
program_titles: ["Diane Program (old)"]
program_type: "XSeries Program"
programs: ["XSeries Program"]
recent_enrollment_count: 26
skill_names: []
subjects: ["Computer Science"]
subtitle: "testing with happiness courses"
title: "Diane Program (old)"
type: "XSeries"
   */
  const {
    programTitle,
    programProvider,
    programSubtitles,
  } = selectedProgram;

  const bulletedList = strInput => {
    const splits = strInput.split('.');
    const items = splits.map(item => <li key={item}>{item}</li>);
    return <ul>{items}</ul>;
  };
  return (
    <>
      <div>
        <ModalDialog
          title="Progream Info Dialog"
          isOpen={isOpen}
          onClose={onClose}
          size="xl"
          hasCloseButton
          isFullscreenOnMobile
          className="course-info-modal"
        >
          <ModalDialog.Body className="full-body p-0">
            <ModalDialog.Hero>
              <ModalDialog.Hero.Background className="course-info-hero" backgroundSrc="" />
            </ModalDialog.Hero>
            <Image className="mr-2 partner-logo-thumbnail" src="" rounded />
            <div className="padded-body">
              <ModalDialog.Title className="h1 course-info-title">
                {programTitle}
              </ModalDialog.Title>
              <ModalDialog.Title className="h2 course-info-partner">
                {programProvider}
              </ModalDialog.Title>
              {/* <CatalogCourseModalBanner
              coursePrice={coursePrice}
              courseAssociatedCatalogs={courseAssociatedCatalogs}
              startDate={startDate}
              endDate={endDate}
              upcomingRuns={upcomingRuns}
            /> */}
              <p className="h3">
                {intl.formatMessage(messages['catalogCourseInfoModal.courseDescriptionTitle'])}
              </p>
              <div className="mt-8">
                <h3>What you will learn:</h3>
                <p>{bulletedList(programSubtitles)}</p>
              </div>
              <div className="mt-8">
                <h3>Courses in this program:</h3>
                <p>{programSubtitles}</p>
              </div>

              {/* eslint-disable-next-line react/no-danger */}
              {/* <div dangerouslySetInnerHTML={{ __html: courseDescription }} />
            {(skillNames.length > 0) && (
              <div className="course-info-skills px-2 py-1">
                <h4 className="mx-2 my-3">
                  {intl.formatMessage(messages['catalogCourseInfoModal.relatedSkillsHeading'])}
                </h4>
                <SkillsListing skillNames={skillNames} />
              </div>
            )} */}
            </div>
          </ModalDialog.Body>

          <ModalDialog.Footer>
            <ActionRow>
              <Hyperlink
                showLaunchIcon={false}
                varient="muted"
                destination=""
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
    programProvider: PropTypes.string,
    programSubtitles: PropTypes.string,
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
  selectedProgram: {
    programTitle: PropTypes.string,
    programProvider: PropTypes.string,
    programSubtitles: PropTypes.string,
  },
};

export default injectIntl(CatalogCourseInfoModal);
