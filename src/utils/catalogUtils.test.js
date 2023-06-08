import { EXEC_ED_TITLE } from '../constants';
import { convertLearningTypesToFilters, createQueryParams } from './catalogUtils';

describe('catalogUtils', () => {
  it('converts lists of learning types to algolia filters', () => {
    const algoliaFilter = convertLearningTypesToFilters(['a', 'b', EXEC_ED_TITLE]);
    expect(algoliaFilter).toEqual('a OR b OR "Executive Education"');
  });

  it('parses an object with an array of values and returns query string', () => {
    const options = {
      enterprise_catalog_query_titles: [
        'A la carte',
      ],
      availability: [
        'Available Now',
        'Starting Soon',
      ],
    };
    const expectedQueryParams = 'enterprise_catalog_query_titles=A+la+carte&availability=Available+Now&availability=Starting+Soon';
    const queryParams = createQueryParams(options);
    expect(queryParams).toEqual(expectedQueryParams);
  });
});
