import qs from 'query-string';

import { getHttpClient } from '@edx/frontend-platform/auth';

class EnterpriseCatalogApiService {
  static enterpriseCatalogServiceApiUrl = `${process.env.CATALOG_SERVICE_BASE_URL}/api/v1/enterprise-catalogs`;

  static apiClient = getHttpClient;

  static fetchIndexedContentMetadata(options, query) {
    const facetQuery = query ? `&query=${query}` : '';
    const enterpriseListUrl = `${EnterpriseCatalogApiService.enterpriseCatalogServiceApiUrl}/catalog_csv_data/?${qs.stringify(options)}${facetQuery}`;
    return EnterpriseCatalogApiService.apiClient().get(enterpriseListUrl);
  }

  static fetchContentMetadataWithFacets(facets, query) {
    return this.fetchIndexedContentMetadata(facets, query)
      .then((response) => {
        const { data } = response;
        return data;
      });
  }
}

export default EnterpriseCatalogApiService;
