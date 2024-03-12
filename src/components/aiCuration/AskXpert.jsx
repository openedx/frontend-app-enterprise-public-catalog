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

const AskXpert = ({ catalogName }) => {
  const [isClose, setIsClose] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [delay, setDelay] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [query, setquery] = useState('');

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
        if (finalResponse.status !== 'IN_PROGRESS' && finalResponse.status !== 'PENDING') {
          setResults(finalResponse.results);
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
    setquery(userQuery);
    try {
      setErrorMessage('');
      setResults([]);
      setTaskId(null);
      setIsLoading(true);
      const queryResponse = await EnterpriseCatalogAiCurationApiService.postXpertQuery(query, catalogName);
      const { status: postRequestStatusCode, data: response } = queryResponse;
      if (postRequestStatusCode < 400) {
        setTaskId(response?.task_id);
        setDelay(1000);
      } else {
        setErrorMessage(response?.error);
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };
  // we will remove this line after passing the results to the results component
  console.log(results);
  const cancelSearch = () => {
    setDelay(null);
    setIsLoading(false);
  };

  return (
    <div className="mt-3 d-flex justify-content-center shadow">
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
                defaultMessage="Ask Xpert"
                description="Ask Xpert title"
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
            onClick={() => setIsClose(!isClose)}
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
  );
};

AskXpert.propTypes = {
  catalogName: PropTypes.string.isRequired,
};

export default AskXpert;
