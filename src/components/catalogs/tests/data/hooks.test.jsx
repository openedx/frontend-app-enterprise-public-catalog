import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import { SearchContext } from '@edx/frontend-enterprise';
import { useAlgoliaIndex, useDefaultSearchFilters, useMarketingSite } from '../../data/hooks';
import { QUERY_UUID_REFINEMENT } from '../../../../constants';

const indexName = 'test';
const appid = 'test app';
const key = 'test key';
const marketingSite = 'http://test.edx.org';
const businessUuid = 'ayylmao';
const eduUuid = 'foo';
const essentialsUuid = 'bar';

const mockConfig = () => (
  {
    ALGOLIA_INDEX_NAME: indexName,
    ALGOLIA_APP_ID: appid,
    ALGOLIA_SEARCH_API_KEY: key,
    HUBSPOT_MARKETING_URL: marketingSite,
    EDX_FOR_BUSINESS_UUID: businessUuid,
    EDX_FOR_ONLINE_EDU_UUID: eduUuid,
    EDX_ONLINE_ESSENTIALS_UUID: essentialsUuid,
  }
);

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

  test('all catalog queries are rendered as query params when no query refinements exist', () => {
    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) => (
      <SearchContext.Provider value={{ refinementsFromQueryParams: {} }}>
        {children}
      </SearchContext.Provider>
    );
    const { result } = renderHook(() => useDefaultSearchFilters(), { wrapper });
    [essentialsUuid, businessUuid, eduUuid].forEach(uuid => expect(result.current).toContain(uuid));
  });
  test('only queries specified in query refinements are rendered as query params', () => {
    const queryUuid = 'blargl';
    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) => (
      <SearchContext.Provider value={{ refinementsFromQueryParams: { [QUERY_UUID_REFINEMENT]: [queryUuid] } }}>
        {children}
      </SearchContext.Provider>
    );
    const { result } = renderHook(() => useDefaultSearchFilters(), { wrapper });
    [essentialsUuid, businessUuid, eduUuid].forEach(uuid => expect(result.current).not.toContain(uuid));
    expect(result.current).toContain(queryUuid);
  });
});
