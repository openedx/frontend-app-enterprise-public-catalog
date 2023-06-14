import { getHttpClient } from '@edx/frontend-platform/auth';
import { createQueryParams } from '../../utils/catalogUtils';

class EnterpriseCatalogApiService {
  static enterpriseCatalogServiceApiUrl = `${process.env.CATALOG_SERVICE_BASE_URL}/api/v1/enterprise-catalogs`;

  static apiClient = getHttpClient;

  static generateCsvDownloadLink(options, query) {
    const facetQuery = query ? `&query=${encodeURIComponent(query)}` : '';
    const queryParams = createQueryParams(options);
    const enterpriseListUrl = `${
      EnterpriseCatalogApiService.enterpriseCatalogServiceApiUrl
    }/catalog_workbook?${queryParams}${facetQuery}`;
    return enterpriseListUrl;
  }

  static fetchDefaultCoursesInCatalog(options) {
    const queryParams = new URLSearchParams(options);
    const enterpriseListUrl = `${
      EnterpriseCatalogApiService.enterpriseCatalogServiceApiUrl
    }/default_course_set?${queryParams.toString()}`;
    return EnterpriseCatalogApiService.apiClient().get(enterpriseListUrl);
  }

  static fetchDefaultCoursesInCatalogWithFacets(facets) {
    return this.fetchDefaultCoursesInCatalog(facets).then((response) => {
      const { data } = response;
      return data;
    });
  }
}

export default EnterpriseCatalogApiService;
