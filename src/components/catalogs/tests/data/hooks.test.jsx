import { renderHook } from '@testing-library/react';

import { useAlgoliaIndex, useMarketingSite } from '../../data/hooks';

const indexName = 'test';
const appid = 'test app';
const key = 'test key';
const marketingSite = 'http://test.edx.org';

const mockConfig = () => ({
  ALGOLIA_INDEX_NAME: indexName,
  ALGOLIA_APP_ID: appid,
  ALGOLIA_SEARCH_API_KEY: key,
  HUBSPOT_MARKETING_URL: marketingSite,
});

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: () => mockConfig(),
}));

describe('hooks function tests', () => {
  test('algolia index name and client fetched from config', () => {
    const { result } = renderHook(() => useAlgoliaIndex());
    expect(result.current.algoliaIndexName).toBe(indexName);
    expect(result.current.searchClient.appId).toBe(appid);
  });

  test('marketing site url resolves from config', () => {
    const { result } = renderHook(() => useMarketingSite());
    expect(result.current).toBe(marketingSite);
  });
});
