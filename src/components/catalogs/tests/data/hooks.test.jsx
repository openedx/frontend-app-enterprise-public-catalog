import { renderHook } from '@testing-library/react-hooks';

import { useAlgoliaIndex } from '../../data/hooks';

describe('hooks function tests', () => {
  test('algolia index name and client fetched from config', () => {
    const indexName = 'ALGOLIA';
    const appid = 'app id';
    const key = 'a key';
    const getConfigFcn = () => (
      {
        ALGOLIA_INDEX_NAME: indexName,
        ALGOLIA_APP_ID: appid,
        ALGOLIA_SEARCH_API_KEY: key,
      }
    );
    const { result } = renderHook(() => useAlgoliaIndex({ getConfigFcn }));
    expect(result.current.algoliaIndexName).toBe(indexName);
    expect(result.current.searchClient.appId).toBe(appid);
  });
});
