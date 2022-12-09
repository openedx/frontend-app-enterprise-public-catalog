import qs from 'query-string';
import {
  FEATURE_ENABLE_PROGRAMS,
  FEATURE_EXEC_ED_INCLUSION,
  FEATURE_PROGRAM_TYPE_FACET,
} from './constants';

const hasFeatureFlagEnabled = (featureFlag) => {
  const { features } = qs.parse(window.location.search);
  return features && features.split(',').includes(featureFlag);
};

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
};

export default features;
