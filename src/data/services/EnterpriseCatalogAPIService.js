import qs from 'query-string';

import { getHttpClient } from '@edx/frontend-platform/auth';

class EnterpriseCatalogApiService {
  static enterpriseCatalogServiceApiUrl = `${process.env.CATALOG_SERVICE_BASE_URL}/api/v1/enterprise-catalogs`;

  static apiClient = getHttpClient;

  static generateCsvDownloadLink(options, query) {
    const facetQuery = query ? `&query=${encodeURIComponent(query)}` : '';
    const enterpriseListUrl = `${
      EnterpriseCatalogApiService.enterpriseCatalogServiceApiUrl
    }/catalog_workbook?${qs.stringify(options)}${facetQuery}`;
    return enterpriseListUrl;
  }

  static fetchDefaultCoursesInCatalog(options) {
    const enterpriseListUrl = `${
      EnterpriseCatalogApiService.enterpriseCatalogServiceApiUrl
    }/default_course_set?${qs.stringify(options)}`;
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
