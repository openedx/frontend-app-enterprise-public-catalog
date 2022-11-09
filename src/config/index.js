import qs from 'query-string';
import {
  FEATURE_ENABLE_PROGRAMS,
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
};

export default features;
