import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import AskXpert from '../AskXpert';
import EnterpriseCatalogAiCurationApiService from '../data/service';

jest.mock('axios');

const messages = {
  en: {
    'catalogPage.askXpert.title': 'Xpert',
    'catalogPage.askXpert.description': 'Use AI to narrow your search.',
    'catalogPage.askXpert.loadingMessage': 'Xpert is thinking! Wait with us while we generate a catalog for <b> “{query}”...</b>',
    'catalogPage.askXpert.cancel': 'Cancel',
  },
};

describe('AskXpert Component', () => {
  const mockCatalogName = 'Mock Catalog';
  const mockOnClose = jest.fn();
  const mockOnXpertData = jest.fn();
  const mockTaskId = 'mock-task-id';
  const mockThreshold = 0.5;
  const mockResponseData = { status: 200, data: { result: {} } };
  const mockErrorResponse = { status: 404, data: { error: 'Not Found' } };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders AskXpert component correctly', () => {
    render(
      <IntlProvider locale="en" messages={messages.en}>
        <AskXpert
          catalogName={mockCatalogName}
          onClose={mockOnClose}
          onXpertData={mockOnXpertData}
        />
      </IntlProvider>,
    );

    expect(screen.getByText(/Xpert/i)).toBeInTheDocument();
    expect(screen.getByText(/Use AI to narrow your search/i)).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <IntlProvider locale="en" messages={messages.en}>
        <AskXpert
          catalogName={mockCatalogName}
          onClose={mockOnClose}
          onXpertData={mockOnXpertData}
        />
      </IntlProvider>,
    );

    fireEvent.click(screen.getByLabelText('Close Ask Xpert Modal'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('postXpertQuery makes a POST request to the correct endpoint', async () => {
    const mockQuery = 'mock query';

    axios.post.mockResolvedValueOnce(mockResponseData);

    const response = await EnterpriseCatalogAiCurationApiService.postXpertQuery(mockQuery, mockCatalogName);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `${EnterpriseCatalogAiCurationApiService.enterpriseCatalogAiCurationServiceUrl}`,
      { query: mockQuery, catalog_name: mockCatalogName },
    );
    expect(response).toEqual(mockResponseData);
  });

  test('postXpertQuery handles errors and returns appropriate response', async () => {
    const mockQuery = 'mock query';

    axios.post.mockRejectedValueOnce({ response: mockErrorResponse });

    const response = await EnterpriseCatalogAiCurationApiService.postXpertQuery(mockQuery, mockCatalogName);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `${EnterpriseCatalogAiCurationApiService.enterpriseCatalogAiCurationServiceUrl}`,
      { query: mockQuery, catalog_name: mockCatalogName },
    );
    expect(response).toEqual(mockErrorResponse);
  });

  test('getXpertResults makes a GET request to the correct endpoint with taskId', async () => {
    axios.get.mockResolvedValueOnce(mockResponseData);

    const response = await EnterpriseCatalogAiCurationApiService.getXpertResults(mockTaskId);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `${EnterpriseCatalogAiCurationApiService.enterpriseCatalogAiCurationServiceUrl}?task_id=${mockTaskId}`,
    );
    expect(response).toEqual(mockResponseData);
  });

  test('getXpertResults makes a GET request with taskId and threshold', async () => {
    axios.get.mockResolvedValueOnce(mockResponseData);

    const response = await EnterpriseCatalogAiCurationApiService.getXpertResults(mockTaskId, mockThreshold);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `${EnterpriseCatalogAiCurationApiService.enterpriseCatalogAiCurationServiceUrl}?task_id=${mockTaskId}&threshold=${mockThreshold}`,
    );
    expect(response).toEqual(mockResponseData);
  });

  test('getXpertResults handles errors and returns appropriate response', async () => {
    axios.get.mockRejectedValueOnce({ response: mockErrorResponse });

    const response = await EnterpriseCatalogAiCurationApiService.getXpertResults(mockTaskId);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `${EnterpriseCatalogAiCurationApiService.enterpriseCatalogAiCurationServiceUrl}?task_id=${mockTaskId}`,
    );
    expect(response).toEqual(mockErrorResponse);
  });
});
