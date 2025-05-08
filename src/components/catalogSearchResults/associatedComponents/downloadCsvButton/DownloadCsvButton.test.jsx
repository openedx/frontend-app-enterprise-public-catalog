import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { saveAs } from 'file-saver';

import userEvent from '@testing-library/user-event';
import DownloadCsvButton from './DownloadCsvButton';
import { renderWithRouter } from '../../../tests/testUtils';
import EnterpriseCatalogApiService from '../../../../data/services/EnterpriseCatalogAPIService';

// file-saver mocks
jest.mock('file-saver', () => ({
  ...jest.requireActual('file-saver'),
  saveAs: jest.fn(),
}));
// eslint-disable-next-line func-names
global.Blob = function (content, options) {
  return { content, options };
};

const mockDate = new Date('2024-01-06T12:00:00Z');
const mockTimestamp = mockDate.toISOString();
global.Date = jest.fn(() => mockDate);

const mockCatalogApiService = jest.spyOn(
  EnterpriseCatalogApiService,
  'generateCsvDownloadLink',
);

const facets = {
  skill_names: ['Research'],
  partners_names: ['Australian National University'],
  enterprise_catalog_query_titles: ['foo'],
  availability: ['Available Now', 'Upcoming'],
};
const defaultProps = { facets, query: 'foo' };

const smallFacets = {
  availability: ['Available Now', 'Upcoming'],
};
const badQueryProps = { facets: smallFacets, query: 'math & science' };

const assignMock = jest.fn();
delete global.location;
global.location = { href: assignMock };

describe('Download button', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('button renders and is clickable', async () => {
    // Render the component
    renderWithRouter(<DownloadCsvButton {...defaultProps} />);
    // Expect to be in the default state
    expect(screen.queryByText('Download results')).toBeInTheDocument();

    // Click the button
    const input = screen.getByText('Download results');
    const user = userEvent.setup();
    await user.click(input);
    expect(mockCatalogApiService).toHaveBeenCalledWith(facets, 'foo');
  });
  test('download button url encodes queries', async () => {
    process.env.CATALOG_SERVICE_BASE_URL = 'foobar.com';
    const mockResponse = {
      data: 'mock-excel-data',
      headers: {
        'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    };
    mockCatalogApiService.mockResolvedValue(mockResponse);
    // Render the component
    renderWithRouter(<DownloadCsvButton {...badQueryProps} />);
    // Expect to be in the default state
    expect(screen.queryByText('Download results')).toBeInTheDocument();

    // Click the button
    const input = screen.getByText('Download results');
    const user = userEvent.setup();
    await user.click(input);
    expect(mockCatalogApiService).toHaveBeenCalledTimes(1);
    expect(mockCatalogApiService).toHaveBeenCalledWith(smallFacets, 'math & science');

    expect(saveAs).toHaveBeenCalledWith(
      expect.objectContaining({
        content: ['mock-excel-data'],
        options: {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      }),
      `Enterprise-Catalog-Export-${mockTimestamp}.xlsx`,
    );
  });
});
