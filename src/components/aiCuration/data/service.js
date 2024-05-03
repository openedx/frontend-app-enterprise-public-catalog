// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

class EnterpriseCatalogAiCurationApiService {
  static enterpriseCatalogAiCurationServiceUrl = `${process.env.CATALOG_SERVICE_BASE_URL}/api/v1/ai-curation`;

  static MAX_RETRIES = 10;

  static RETRY_INTERVAL = 1000;

  static async postXpertQuery(query, catalogName) {
    try {
      const response = await axios.post(`${EnterpriseCatalogAiCurationApiService.enterpriseCatalogAiCurationServiceUrl}`, {
        query,
        catalog_name: catalogName,
      });
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      return {
        status: error.response.status,
        data: error.response.data,
      };
    }
  }

  static wait(ms) {
    return new Promise(resolve => { setTimeout(resolve, ms); });
  }

  static async getXpertResults(taskId, threshold = 0) {
    try {
      const response = await axios.get(`${EnterpriseCatalogAiCurationApiService.enterpriseCatalogAiCurationServiceUrl}?task_id=${taskId}&threshold=${threshold}`);
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      return {
        status: error.response.status,
        data: error.response.data,
      };
    }
  }
}

export default EnterpriseCatalogAiCurationApiService;
