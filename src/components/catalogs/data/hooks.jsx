/* eslint-disable import/prefer-default-export */
import { useMemo } from 'react';

import algoliasearch from 'algoliasearch/lite';

import { getConfig } from '@edx/frontend-platform';

/**
 * @param {Function} args.getConfigFcn inject config fetcher if necessary
 */
const useAlgoliaIndex = ({ getConfigFcn = getConfig }) => {
  // note: calling the getConfig outside of a hook/render function won't work
  // if using `mergeConfig`
  const config = getConfigFcn();
  const searchClient = useMemo(() => algoliasearch(
    config.ALGOLIA_APP_ID,
    config.ALGOLIA_SEARCH_API_KEY,
  ), [config]);
  return { algoliaIndexName: config.ALGOLIA_INDEX_NAME, searchClient };
};
export {
  useAlgoliaIndex,
};
