import { hasFeatureFlagEnabled } from '@edx/frontend-enterprise-utils';
import {
  FEATURE_ENABLE_PROGRAMS,
  FEATURE_EXEC_ED_INCLUSION,
  FEATURE_PROGRAM_TYPE_FACET,
} from './constants';

const features = {
  ENABLE_PROGRAMS:
    process.env.FEATURE_ENABLE_PROGRAMS
    || hasFeatureFlagEnabled(FEATURE_ENABLE_PROGRAMS),
  PROGRAM_TYPE_FACET:
    process.env.FEATURE_PROGRAM_TYPE_FACET
    || hasFeatureFlagEnabled(FEATURE_PROGRAM_TYPE_FACET),
  EXEC_ED_INCLUSION:
    process.env.EXEC_ED_INCLUSION
    || hasFeatureFlagEnabled(FEATURE_EXEC_ED_INCLUSION),
};

export default features;
