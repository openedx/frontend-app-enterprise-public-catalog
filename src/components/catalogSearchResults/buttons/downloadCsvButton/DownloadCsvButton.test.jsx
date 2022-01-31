import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import userEvent from '@testing-library/user-event';
import DownloadCsvButton from './DownloadCsvButton';

import EnterpriseCatalogApiService from '../../../../data/services/EnterpriseCatalogAPIService';

// file-saver mocks
jest.mock('file-saver', () => ({ saveAs: jest.fn() }));
// eslint-disable-next-line func-names
global.Blob = function (content, options) { return ({ content, options }); };

// Enterprise catalog API mocks
jest.spyOn(EnterpriseCatalogApiService, 'generateCsvDownloadLink').mockResolvedValue(
  'https://example.com/download',
);

const facets = {
  skill_names: ['Research'],
  partners_names: ['Australian National University'],
  enterprise_catalog_query_titles: ['foo'],
  availability: ['Available Now', 'Upcoming'],
};
const defaultProps = { facets, query: 'foo' };

const assignMock = jest.fn();
delete global.location;
global.location = { href: assignMock };

describe('Course card works as expected', () => {
  test('card renders as expected', async () => {
    // Render the component
    render(
      <DownloadCsvButton {...defaultProps} />,
    );
    // Expect to be in the default state
    expect(screen.queryByText('Download results')).toBeInTheDocument();

    // Click the button
    await act(async () => {
      const input = screen.getByText('Download results');
      userEvent.click(input);
    });
  });
});
