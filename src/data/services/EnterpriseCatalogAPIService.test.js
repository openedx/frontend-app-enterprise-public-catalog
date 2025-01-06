import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import EnterpriseCatalogApiService from './EnterpriseCatalogAPIService';

jest.mock('axios');

describe('EnterpriseCatalogApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCsvDownloadLink', () => {
    it('makes correct axios GET request with query parameters', async () => {
      const options = { enterprise_catalog_query_titles: 'test' };
      const query = 'somequery';
      const expectedUrl = `${process.env.CATALOG_SERVICE_BASE_URL}/api/v1/enterprise-catalogs/catalog_workbook?enterprise_catalog_query_titles=test&query=somequery`;

      const mockResponse = { data: 'test-data' };
      axios.get.mockResolvedValue(mockResponse);

      const result = await EnterpriseCatalogApiService.generateCsvDownloadLink(options, query);

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(expectedUrl, { responseType: 'blob' });
      expect(result).toEqual(mockResponse);
    });

    it('handles axios error', async () => {
      const options = { enterprise_catalog_query_titles: 'test' };
      const error = new Error('Network error');
      axios.get.mockRejectedValue(error);

      await expect(
        EnterpriseCatalogApiService.generateCsvDownloadLink(options),
      ).rejects.toThrow('Network error');
    });
  });
});
