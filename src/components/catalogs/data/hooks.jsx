/* eslint-disable import/prefer-default-export */
import { useMemo, useState } from 'react';

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

const useSelectedCourse = () => {
  const [course, setCourse] = useState(null);
  const isProgram = useMemo(() => course && course.programTitle !== undefined, [course]);
  const isCourse = useMemo(() => (course && course.courseTitle !== undefined), [course]);
  return [course, setCourse, isProgram, isCourse];
};

export {
  useAlgoliaIndex,
  useMarketingSite,
  useSelectedCourse,
};
