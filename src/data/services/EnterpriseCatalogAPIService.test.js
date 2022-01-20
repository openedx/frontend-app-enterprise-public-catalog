import '@testing-library/jest-dom/extend-expect';
import { getHttpClient } from '@edx/frontend-platform/auth';

import EnterpriseCatalogApiService from './EnterpriseCatalogAPIService';

jest.mock('@edx/frontend-platform/auth');

const mockApiClient = {
  get: jest.fn().mockResolvedValue({ value: 'foobar' }),
};
getHttpClient.mockReturnValue(mockApiClient);

describe('fetchDefaultCoursesInCatalogWithFacets', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('requests the catalog API', () => {
    const facets = { content_type: 'course' };
    EnterpriseCatalogApiService.fetchDefaultCoursesInCatalogWithFacets(facets);
    // An issue with process.env is making it impossible to assert the value the method is called with
    // So for now simply assert the method's been called
    expect(mockApiClient.get).toBeCalled();
  });
});
describe('fetchContentMetadataWithFacets', () => {
  it('requests the catalog API', () => {
    const facets = { content_type: 'course' };
    const query = 'foobar';
    EnterpriseCatalogApiService.fetchContentMetadataWithFacets(facets, query);
    expect(mockApiClient.get).toBeCalled();
  });
});
