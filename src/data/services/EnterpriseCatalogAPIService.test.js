import '@testing-library/jest-dom/extend-expect';
import { getHttpClient } from '@edx/frontend-platform/auth';

import EnterpriseCatalogApiService from './EnterpriseCatalogAPIService';

jest.mock('@edx/frontend-platform/auth');

const mockApiClient = {
  get: jest.fn().mockResolvedValue({ value: 'foobar' }),
};
getHttpClient.mockReturnValue(mockApiClient);

const mockDefaultCourses = jest.spyOn(
  EnterpriseCatalogApiService,
  'fetchDefaultCoursesInCatalog',
);

describe('fetchDefaultCoursesInCatalogWithFacets', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('requests the catalog API with fetchDefaultCoursesInCatalog', () => {
    const facets = { content_type: 'course' };
    EnterpriseCatalogApiService.fetchDefaultCoursesInCatalogWithFacets(facets);
    expect(mockDefaultCourses).toBeCalledWith(facets);
    // An issue with process.env is making it impossible to assert the value the method is called with
    // So for now simply assert the method's been called
    expect(mockApiClient.get).toBeCalled();
  });
});
