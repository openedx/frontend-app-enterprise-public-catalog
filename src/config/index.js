import { hasFeatureFlagEnabled } from '@edx/frontend-enterprise-utils';
import {
  FEATURE_CONSOLIDATE_SUBS_CATALOG,
  FEATURE_ENABLE_PROGRAMS,
  FEATURE_EXEC_ED_INCLUSION,
  FEATURE_PROGRAM_TYPE_FACET,
} from './constants';

const features = {
  ENABLE_PROGRAMS:
    process.env.FEATURE_ENABLE_PROGRAMS === 'true'
    || hasFeatureFlagEnabled(FEATURE_ENABLE_PROGRAMS),
  PROGRAM_TYPE_FACET:
    process.env.FEATURE_PROGRAM_TYPE_FACET === 'true'
    || hasFeatureFlagEnabled(FEATURE_PROGRAM_TYPE_FACET),
  EXEC_ED_INCLUSION:
    process.env.EXEC_ED_INCLUSION === 'true'
    || hasFeatureFlagEnabled(FEATURE_EXEC_ED_INCLUSION),
  CONSOLIDATE_SUBS_CATALOG:
    process.env.CONSOLIDATE_SUBS_CATALOG === 'true'
    || hasFeatureFlagEnabled(FEATURE_CONSOLIDATE_SUBS_CATALOG),
};

export default features;
