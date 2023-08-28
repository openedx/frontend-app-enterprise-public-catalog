import React from 'react';
import { screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import userEvent from '@testing-library/user-event';
import DownloadCsvButton from './DownloadCsvButton';
import { renderWithRouter } from '../../../tests/testUtils';
import EnterpriseCatalogApiService from '../../../../data/services/EnterpriseCatalogAPIService';

// file-saver mocks
jest.mock('file-saver', () => ({ saveAs: jest.fn() }));
// eslint-disable-next-line func-names
global.Blob = function (content, options) {
  return { content, options };
};

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
  test('button renders and is clickable', async () => {
    // Render the component
    renderWithRouter(<DownloadCsvButton {...defaultProps} />);
    // Expect to be in the default state
    expect(screen.queryByText('Download results')).toBeInTheDocument();

    // Click the button
    await act(async () => {
      const input = screen.getByText('Download results');
      userEvent.click(input);
    });
    expect(mockCatalogApiService).toBeCalledWith(facets, 'foo');
  });
  test('download button url encodes queries', async () => {
    process.env.CATALOG_SERVICE_BASE_URL = 'foobar.com';
    // Render the component
    renderWithRouter(<DownloadCsvButton {...badQueryProps} />);
    // Expect to be in the default state
    expect(screen.queryByText('Download results')).toBeInTheDocument();

    // Click the button
    await act(async () => {
      const input = screen.getByText('Download results');
      userEvent.click(input);
    });
    const expectedWindowLocation = `${process.env.CATALOG_SERVICE_BASE_URL}/api/v1/enterprise-catalogs/catalog_workbook?availability=Available`
      + '+Now&availability=Upcoming&query=math%20%26%20science';
    expect(window.location.href).toEqual(expectedWindowLocation);
  });
});
