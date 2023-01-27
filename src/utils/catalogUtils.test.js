import { EXEC_ED_TITLE } from '../constants';
import { convertLearningTypesToFilters } from './catalogUtils';

describe('catalogUtils', () => {
  it('converts lists of learning types to algolia filters', () => {
    const algoliaFilter = convertLearningTypesToFilters(['a', 'b', EXEC_ED_TITLE]);
    expect(algoliaFilter).toEqual('a OR b OR "Executive Education"');
  });
});
