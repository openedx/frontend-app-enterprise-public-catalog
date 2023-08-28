import '@testing-library/jest-dom/extend-expect';

import EnterpriseCatalogApiService from './EnterpriseCatalogAPIService';

describe('generateCsvDownloadLink', () => {
  test('correctly formats csv download link', () => {
    const options = { enterprise_catalog_query_titles: 'test' };
    const query = 'somequery';
    const generatedDownloadLink = EnterpriseCatalogApiService.generateCsvDownloadLink(
      options,
      query,
    );
    expect(generatedDownloadLink).toEqual(
      `${process.env.CATALOG_SERVICE_BASE_URL}/api/v1/enterprise-catalogs/catalog_workbook?enterprise_catalog_query_titles=test&query=${query}`,
    );
  });
});
