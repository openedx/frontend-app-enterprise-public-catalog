import axios from 'axios';
import { createQueryParams } from '../../utils/catalogUtils';

class EnterpriseCatalogApiService {
  static enterpriseCatalogServiceApiUrl = `${process.env.CATALOG_SERVICE_BASE_URL}/api/v1/enterprise-catalogs`;

  static generateCsvDownloadLink(options, query) {
    const facetQuery = query ? `&query=${encodeURIComponent(query)}` : '';
    const queryParams = createQueryParams(options);
    const enterpriseListUrl = `${
      EnterpriseCatalogApiService.enterpriseCatalogServiceApiUrl
    }/catalog_workbook?${queryParams}${facetQuery}`;

    return axios.get(enterpriseListUrl, { responseType: 'blob' });
  }
}

export default EnterpriseCatalogApiService;
