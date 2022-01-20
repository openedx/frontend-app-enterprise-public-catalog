import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const discoveryServiceUrl = `${process.env.DISCOVERY_SERVICE_BASE_URL}/api/v1/programs`;

const fetchProgramInfo = (programUuid) => {
  const url = `${discoveryServiceUrl}/${programUuid}/`;
  return getAuthenticatedHttpClient().get(url)
    .then((response) => {
      const { data } = response;
      return data;
    });
};

export default fetchProgramInfo;
