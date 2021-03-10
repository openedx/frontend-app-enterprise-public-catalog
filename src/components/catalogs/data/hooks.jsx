/* eslint-disable import/prefer-default-export */
import { useMemo } from 'react';

import algoliasearch from 'algoliasearch/lite';

import { getConfig } from '@edx/frontend-platform';

const useAlgoliaIndex = () => {
  // if we create a new instance of algoliasearch it will generate new queries!
  // we cannot move this outside the component function here since mergeConfig based vars
  // will not work when calling getConfig()
  const config = getConfig();
  const searchClient = useMemo(() => algoliasearch(
    config.ALGOLIA_APP_ID,
    config.ALGOLIA_SEARCH_API_KEY,
  ), [config]);
  return { algoliaIndexName: config.ALGOLIA_INDEX_NAME, searchClient };
};
export {
  useAlgoliaIndex,
};
