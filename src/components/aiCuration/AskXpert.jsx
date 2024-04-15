import React, { useState } from 'react';
import {
  Card,
  Stack,
  Button,
  Row,
  Col,
  Image,
  IconButton,
  Icon,
} from '@edx/paragon';
import { Close } from '@edx/paragon/icons';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import edxXPERT from '../../assets/edx-xpert-card-side-image.png';
import AskXpertQueryField from './AskXpertQueryField';
import EnterpriseCatalogAiCurationApiService from './data/service';
import LoadingBar from './ProgressBar';
import useInterval from './data/hooks';
import XpertResultCard from './xpertResultCard/XpertResultCard';
import { hasNonEmptyValues } from '../../utils/common';
import {
  CONTENT_TYPE_COURSE,
  CONTENT_TYPE_PROGRAM,
  EXEC_ED_TITLE,
  XPERT_RESULT_STATUSES,
} from '../../constants';

const AskXpert = ({ catalogName, onClose, onXpertData }) => {
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [delay, setDelay] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [query, setQuery] = useState('');
  const [showXpertResultCard, setShowXpertResultCard] = useState(false);

  useInterval(async () => {
    if (!isLoading || !taskId) {
      setDelay(null);
      setIsLoading(false);
      return;
    }
    try {
      const response = await EnterpriseCatalogAiCurationApiService.getXpertResults(taskId);
      const { status, data: finalResponse } = response;

      if (status < 400) {
        if (!XPERT_RESULT_STATUSES.includes(finalResponse.status)) {
          setResults(finalResponse.result);
          if (finalResponse.result) {
            setShowXpertResultCard(hasNonEmptyValues(finalResponse.result));

            const aggregationKeys = {
              [CONTENT_TYPE_COURSE]: finalResponse?.result?.ocm_courses.map(item => item.aggregation_key),
              [EXEC_ED_TITLE]: finalResponse?.result?.exec_ed_courses.map(item => item.aggregation_key),
              [CONTENT_TYPE_PROGRAM]: finalResponse?.result?.programs.map(item => item.aggregation_key),
            };

            onXpertData(aggregationKeys); // Pass aggregationKeys to CatalogSearch
          } else {
            // Handles the scenario where request is successful but no data is returned.
            setErrorMessage('Hm, I didnt find anything. Try telling me about the subjects, jobs, or skills you are trying to train in your organization.');
          }
          setIsLoading(false);
          setDelay(null);
        }
      } else {
        setErrorMessage(finalResponse.error);
        setDelay(null);
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setDelay(null);
      setIsLoading(false);
    }
  }, delay);

  const onSubmit = async (userQuery) => {
    const defaultErrorMessage = 'An error occurred. Please try again.';
    setQuery(userQuery);
    try {
      setErrorMessage('');
      setResults({});
      setTaskId(null);
      setIsLoading(true);
      const queryResponse = await EnterpriseCatalogAiCurationApiService.postXpertQuery(userQuery, catalogName);
      const { status: postRequestStatusCode, data: response } = queryResponse;
      if (postRequestStatusCode < 400 && response.status !== 'FAILURE') {
        setTaskId(response?.task_id);
        setDelay(1000);
      } else {
        setErrorMessage(response?.error || defaultErrorMessage);
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage(defaultErrorMessage);
      setIsLoading(false);
    }
  };
  const cancelSearch = () => {
    setDelay(null);
    setIsLoading(false);
  };

  return (
    <>
      { !showXpertResultCard && (
      <div className="mt-3 mb-6 d-flex justify-content-center shadow">
        <Card orientation="horizontal" className="row bg-primary-700 w-100">
          <Card.Section className="col-3">
            <Image
              src={edxXPERT}
              alt="edx Xpert logo"
              fluid
            />
          </Card.Section>
          <Card.Section className="col-6 mb-0">
            <Stack gap={2}>
              <h1 className="text-white">
                <FormattedMessage
                  id="catalogPage.askXpert.title"
                  defaultMessage="Xpert"
                  description="Xpert title"
                />
              </h1>
              <p className="text-accent-b">
                <FormattedMessage
                  id="catalogPage.askXpert.description"
                  defaultMessage="Use AI to narrow your search."
                  description="Ask Xpert description"
                />
              </p>
              <AskXpertQueryField onSubmit={onSubmit} isDisabled={isLoading} />
              {errorMessage?.length > 0 && <p className="text-danger">{errorMessage}</p>}
              {isLoading && (
              <div>
                <p className="text-white">
                  <FormattedMessage
                    id="catalogPage.askXpert.loadingMessage"
                  defaultMessage="Xpert is thinking! Wait with us while we generate a catalog for <b> “{query}”...</b>" // eslint-disable-line
                    description="Loading message for Xpert."
                    values={{
                      // eslint-disable-next-line react/no-unstable-nested-components
                      b: (chunks) => <b>{chunks}</b>,
                      query,
                    }}
                  />
                </p>
                <Row className="align-items-center" noGutters>
                  <Col xs={12} md={2}>
                    <Button variant="inverse-outline-primary" onClick={cancelSearch}>
                      <FormattedMessage
                        id="catalogPage.askXpert.cancel"
                        defaultMessage="Cancel"
                        description="Cancel button text for Xpert to cancel the search."
                      />
                    </Button>
                  </Col>
                  <Col xs={12} md={9}>
                    <LoadingBar isLoading={isLoading} />
                  </Col>
                </Row>
              </div>
              )}
            </Stack>
          </Card.Section>
          <Card.Section className="col-3 d-flex flex-column justify-content-between align-items-end pb-0">
            <IconButton
              invertColors
              src={Close}
              iconAs={Icon}
              onClick={() => onClose()}
            />
            <p className="text-white">
              <FormattedMessage
                id="catalogPage.askXpert.poweredBy"
                defaultMessage="Powered by OpenAI"
                description="Powered by OpenAI"
              />
            </p>
          </Card.Section>
        </Card>
      </div>
      )}
      {!isLoading && showXpertResultCard && (
      <XpertResultCard
        taskId={taskId}
        query={query}
        results={results}
        onClose={() => setShowXpertResultCard(false)}
        onXpertResults={(aggregationKeys) => onXpertData(aggregationKeys)}
      />
      )}
    </>
  );
};

AskXpert.propTypes = {
  catalogName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onXpertData: PropTypes.func.isRequired,
};

export default AskXpert;
