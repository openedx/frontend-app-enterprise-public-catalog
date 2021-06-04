/* eslint-disable import/prefer-default-export */
import { useContext, useMemo } from 'react';

import algoliasearch from 'algoliasearch/lite';

import { getConfig } from '@edx/frontend-platform';
import { SearchContext } from '@edx/frontend-enterprise';
import { QUERY_UUID_REFINEMENT } from '../../../constants';

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

const useDefaultSearchFilters = () => {
  const { refinementsFromQueryParams } = useContext(SearchContext);
  const config = getConfig();
  const allQueryUuids = [
    config.EDX_FOR_BUSINESS_UUID,
    config.EDX_FOR_ONLINE_EDU_UUID,
    config.EDX_ONLINE_ESSENTIALS_UUID,
  ];
  const filters = (uuids) => {
    const queryReducer = (result, uuid, index) => {
      const isLastCatalogQuery = index === uuids.length - 1;
      let query = ''.concat(result, 'enterprise_catalog_query_uuids:').concat(uuid);
      if (!isLastCatalogQuery) {
        query += ' OR ';
      }
      return query;
    };

    return uuids.reduce(queryReducer, '');
  };
  if (!refinementsFromQueryParams[QUERY_UUID_REFINEMENT]) {
    return filters(allQueryUuids);
  }
  return filters(refinementsFromQueryParams[QUERY_UUID_REFINEMENT]);
};

export {
  useAlgoliaIndex,
  useMarketingSite,
  useDefaultSearchFilters,
};
