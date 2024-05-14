// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

class EnterpriseCatalogAiCurationApiService {
  static enterpriseCatalogAiCurationServiceUrl = `${process.env.CATALOG_SERVICE_BASE_URL}/api/v1/ai-curation`;

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

  static async getXpertResults(taskId, threshold) {
    try {
      let url = `${EnterpriseCatalogAiCurationApiService.enterpriseCatalogAiCurationServiceUrl}?task_id=${taskId}`;
      if (threshold) {
        url += `&threshold=${threshold}`;
      }

      const response = await axios.get(url);
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
