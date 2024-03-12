import axios from 'axios';

class EnterpriseCatalogAiCurationApiService {
  static enterpriseCatalogAiCurationServiceUrl = `${process.env.CATALOG_SERVICE_BASE_URL}/api/v1/ai-curation`;

  static MAX_RETRIES = 10;

  static RETRY_INTERVAL = 1000;

  static async postXpertQuery(query, catalogName) {
    try {
      const response = await axios.post(`${EnterpriseCatalogAiCurationApiService.enterpriseCatalogAiCurationServiceUrl}`, {
        query,
        // catalog_id: '7af27a1d-8012-4985-b89f-9c8bdd46b3a2',
        catalog_id: catalogName,
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

  static async getXpertResults(taskId, retries = 0) {
    try {
      const response = await axios.get(`${process.env.CATALOG_SERVICE_BASE_URL}/api/v1/ai-curation?task_id=${taskId}`);
      if (response.data.status === 'IN_PROGRESS' || response.data.status === 'PENDING') {
        if (retries < this.MAX_RETRIES) {
          await this.wait(this.RETRY_INTERVAL);
          return this.getXpertResults(taskId, retries + 1);
        }
        throw new Error('Maximum retry count exceeded');
      }
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
