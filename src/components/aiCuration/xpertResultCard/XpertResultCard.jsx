import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Icon, Card, Stack, Form, Button, Spinner, Image,
} from '@openedx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Close } from '@openedx/paragon/icons';
import askXpretImage from '../../../assets/edx-xpert-card-side-image.png';
import { useXpertResultsWithThreshold } from '../data/hooks';
import {
  CONTENT_TYPE_COURSE,
  CONTENT_TYPE_PROGRAM,
  EXEC_ED_TITLE,
} from '../../../constants';

const debounce = require('lodash.debounce');

const XpertResultCard = ({
  taskId, query, results, onClose, onXpertResults,
}) => {
  const [thresholdValue, setThresholdValue] = useState(0);
  const [xpertResults, setXpertResults] = useState(results);
  const {
    loading, error, xpertResultsData, getXpertResultsWithThreshold,
  } = useXpertResultsWithThreshold();

  const debouncedHandleChange = useMemo(() => debounce(async (threshold) => {
    getXpertResultsWithThreshold(taskId, threshold);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, 1000), [taskId]);

  useEffect(() => {
    if (xpertResultsData && Object.keys(xpertResultsData).length > 0) {
      setXpertResults(xpertResultsData);
      const aggregationKeys = {
        [CONTENT_TYPE_COURSE]: xpertResultsData.ocm_courses?.map(item => item.aggregation_key),
        [EXEC_ED_TITLE]: xpertResultsData.exec_ed_courses?.map(item => item.aggregation_key),
        [CONTENT_TYPE_PROGRAM]: xpertResultsData.programs?.map(item => item.aggregation_key),
      };
      onXpertResults(aggregationKeys);
    } else if (error) {
      setXpertResults({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdValue, xpertResultsData]);

  // The API call for tweaking should only be triggered when the user releases the slider after sliding through
  // multiple values. This debounce mechanism helps prevent multiple API calls within a short time frame,
  // which can lead to issues such as receiving a 429 (too many requests) response from the server.
  const handleChange = (e) => {
    const threshold = Number(e.target.value);
    setThresholdValue(threshold);

    clearTimeout(window.sliderTimeout);
    window.sliderTimeout = setTimeout(() => {
      debouncedHandleChange(threshold);
    }, 300);
  };

  const xpertResultStats = useMemo(() => ({
    selfPacedCoursesCount: xpertResults.ocm_courses?.length,
    selfPacedProgramsCount: xpertResults.programs?.length,
    execEdCoursesCount: xpertResults.exec_ed_courses?.length,
  }), [xpertResults]);

  const { selfPacedCoursesCount, selfPacedProgramsCount, execEdCoursesCount } = xpertResultStats;

  return (
    <div className="mt-3 d-flex justify-content-center">
      <Card orientation="horizontal" className="bg-primary-700 w-100 row">
        <Card.Section className="col-3">
          <Image
            src={askXpretImage}
            alt="edx Xpert logo"
            fluid
          />
        </Card.Section>
        <Card.Section className="col-6">
          <Stack gap={3}>
            <h1 className="text-white">
              <FormattedMessage
                id="catalogs.askXpert.result.card.heading"
                defaultMessage="Xpert"
                description="Heading displayed on askXpert result card"
              />
            </h1>
            <div className="text-white">
              <FormattedMessage
                id="catalogs.askXpert.result.card.label.for.results"
                defaultMessage="Results: {query}"
                description="Results label to display askXpert search results on askXpert result card"
                values={{ query: <b>{query}</b> }}
              />
            </div>
            {xpertResults && Object.keys(xpertResults).length > 0
                && (
                <div className="d-flex align-items-center text-white">
                  <div className="d-flex align-items-center mr-4">
                    {loading
                      ? <Spinner animation="border" variant="light" className="mr-2" />
                      : <h1 className="text-white mr-2">{selfPacedCoursesCount}</h1>}
                    <span className="font-italic">
                      <FormattedMessage
                        id="catalogs.askXpert.result.card.label.for.self.paced.courses"
                        defaultMessage="Self-paced courses"
                        description="Label to display self-paced courses count on askXpert result card"
                      />
                    </span>
                  </div>
                  <div className="d-flex align-items-center mr-4">
                    {loading
                      ? <Spinner animation="border" variant="light" className="mr-2" />
                      : <h1 className="text-white mr-2">{selfPacedProgramsCount}</h1>}
                    <span className="font-italic">
                      <FormattedMessage
                        id="catalogs.askXpert.result.card.label.for.self.paced.programs"
                        defaultMessage="Self-paced programs"
                        description="Label to display self-paced programs count on askXpert result card"
                      />
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    {loading
                      ? <Spinner animation="border" variant="light" className="mr-2" />
                      : <h1 className="text-white mr-2">{execEdCoursesCount}</h1>}
                    <span className="font-italic">
                      <FormattedMessage
                        id="catalogs.askXpert.result.card.label.for.executive.education.courses"
                        defaultMessage="Executive education courses"
                        description="Label to display executive education courses count on askXpert result card"
                      />
                    </span>
                  </div>
                </div>
                )}
            {error
              && (
              <p className="text-white">
                <FormattedMessage
                  id="catalogs.askXpert.result.card.error.label"
                  defaultMessage="An error occurred. Please try a new search"
                  description="Error message displayed in case of an error on the askXpert result card"
                />
              </p>
              )}
            <div className="text-white mt-4">
              <Form.Group className="">
                <Form.Label className="h2 text-white mb-3 font-weight-bold">
                  Update your results
                </Form.Label>
                <datalist id="values" className="d-flex justify-content-between mb-1">
                  <option value="0" label="Broad" className="p-0 font-weight-normal" />
                  <option value="0.8" label="Focused" className="p-0 font-weight-normal" />
                </datalist>
                <Form.Control
                  type="range"
                  role="slider"
                  value={thresholdValue}
                  onChange={handleChange}
                  min="0"
                  max="0.8"
                  step="0.2"
                  list="values"
                  aria-valuemin="0"
                  aria-valuemax="0.8"
                  className="m-0"
                  aria-label="Xpert result card slider"
                />
              </Form.Group>
            </div>
          </Stack>
        </Card.Section>
        <Card.Section className="col-3">
          <div className="d-flex justify-content-end align-items-center">
            <Button
              variant="inverse-outline-primary mr-3 btn-sm"
              onClick={onClose}
              aria-label="Close XpertResultCard"
            >New Search
            </Button>
            <Icon
              src={Close}
              className="text-white"
              onClick={onClose}
            />
          </div>
        </Card.Section>
        <Card.Section className="row d-flex justify-content-end m-0 pt-0 pb-0">
          <p className="text-white">Powered by OpenAI</p>
        </Card.Section>
      </Card>
    </div>
  );
};

XpertResultCard.propTypes = {
  taskId: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.shape({
    ocm_courses: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        short_description: PropTypes.string.isRequired,
        program_titles: PropTypes.arrayOf(PropTypes.string).isRequired,
        skills: PropTypes.arrayOf(PropTypes.string).isRequired,
        subjects: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    ).isRequired,
    exec_ed_courses: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        short_description: PropTypes.string.isRequired,
        program_titles: PropTypes.arrayOf(PropTypes.string).isRequired,
        skills: PropTypes.arrayOf(PropTypes.string).isRequired,
        subjects: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    ).isRequired,
    programs: PropTypes.arrayOf(
      PropTypes.shape({
        aggregation_key: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        short_description: PropTypes.string.isRequired,
        skills: PropTypes.arrayOf(PropTypes.string).isRequired,
        subjects: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onXpertResults: PropTypes.func.isRequired,
};

export default XpertResultCard;
