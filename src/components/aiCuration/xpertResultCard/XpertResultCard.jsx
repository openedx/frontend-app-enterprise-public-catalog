import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Icon, Card, Stack, Form, Button, Spinner, Image,
} from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Close } from '@edx/paragon/icons';
import askXpretImage from '../../../assets/edx-xpert-card-side-image.png';
import { useXpertResultsWithThreshold } from '../data/hooks';
import {
  CONTENT_TYPE_COURSE,
  CONTENT_TYPE_PROGRAM,
  EXEC_ED_TITLE,
} from '../../../constants';

const debounce = require('lodash.debounce');

const XpertResultCard = ({ taskId, queryTitle, xpertData }) => {
  const [thresholdValue, setThresholdValue] = useState(0);
  const [xpertResults, setXpertResults] = useState(xpertData);
  const {
    loading, error, xpertResultsData, getXpertResultsWithThreshold,
  } = useXpertResultsWithThreshold();

  const debouncedHandleChange = debounce(async (threshold) => {
    getXpertResultsWithThreshold(taskId, threshold);

    if (xpertResultsData) {
      setXpertResults(xpertResultsData);
    }
  }, 1000);

  const handleChange = async (e) => {
    const threshold = Number(e.target.value);
    setThresholdValue(threshold);

    debouncedHandleChange(threshold);
  };

  const xpertResultStats = useMemo(() => {
    const selfPacedCoursesCount = xpertResults.filter(item => item.learning_type === CONTENT_TYPE_COURSE).length;
    const selfPacedProgramsCount = xpertResults.filter(item => item.learning_type === CONTENT_TYPE_PROGRAM).length;
    const execEdCoursesCount = xpertResults.filter(item => item.learning_type === EXEC_ED_TITLE).length;

    return {
      selfPacedCoursesCount,
      selfPacedProgramsCount,
      execEdCoursesCount,
    };
  }, [xpertResults]);

  const { selfPacedCoursesCount, selfPacedProgramsCount, execEdCoursesCount } = xpertResultStats;

  return (
    <div>
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
                  defaultMessage="Results: {queryTitle}"
                  description="Results label to display askXpert search results on askXpert result card"
                  values={{ queryTitle: <b>{queryTitle}</b> }}
                />
              </div>
              {xpertResults && xpertResults.length > 0
                && (
                <div className="d-flex align-xpertResults-center text-white">
                  <div className="d-flex align-xpertResults-center mr-4">
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
                  <div className="d-flex align-xpertResults-center mr-4">
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
                  <div className="d-flex align-xpertResults-center">
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
              {!error && !xpertResults.length
              && (
              <p className="text-white">
                <FormattedMessage
                  id="catalogs.askXpert.result.card.no.data.found.error.message"
                  defaultMessage="No course/program found against your filter criteria, please select a broader focus to get results"
                  description="Error message displayed when no course/program is found against the selected filter value, on askXpert result card"
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
                  />
                </Form.Group>
              </div>
            </Stack>
          </Card.Section>
          <Card.Section className="col-3">
            <div className="d-flex justify-content-end d-flex align-xpertResults-center">
              <Button variant="inverse-outline-primary mr-3 btn-sm">New Search</Button>
              <Icon src={Close} className="text-white" />
            </div>
          </Card.Section>
          <Card.Section className="row d-flex justify-content-end m-0 pt-0 pb-0">
            <p className="text-white">Powered by OpenAI</p>
          </Card.Section>
        </Card>
      </div>
    </div>
  );
};

XpertResultCard.propTypes = {
  taskId: PropTypes.number.isRequired,
  queryTitle: PropTypes.string.isRequired,
  xpertData: PropTypes.arrayOf(
    PropTypes.shape({
      learning_type: PropTypes.string.isRequired,
      queryTitle: PropTypes.string,
      card_image_url: PropTypes.string,
      course_keys: PropTypes.arrayOf(PropTypes.string),
      enterprise_catalog_query_queryTitles: PropTypes.arrayOf(PropTypes.string),
      original_image_url: PropTypes.string,
    }),
  ).isRequired,
};

export default XpertResultCard;
