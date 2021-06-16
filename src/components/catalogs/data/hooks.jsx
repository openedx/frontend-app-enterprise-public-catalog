/* eslint-disable import/prefer-default-export */
import { useMemo } from 'react';

import algoliasearch from 'algoliasearch/lite';

import { getConfig } from '@edx/frontend-platform';

const useAlgoliaIndex = () => {
  // note: calling the getConfig outside of a hook/render function won't work
  // if using `mergeConfig`
  const config = getConfig();
  const searchClient = useMemo(() => algoliasearch(
    config.ALGOLIA_APP_ID,
    config.ALGOLIA_SEARCH_API_KEY,
  ), [config]);
  return { algoliaIndexName: config.ALGOLIA_INDEX_NAME, searchClient };
};

const useMarketingSite = () => {
  const config = getConfig();
  return config.HUBSPOT_MARKETING_URL;
};

export {
  useAlgoliaIndex,
  useMarketingSite,
};
