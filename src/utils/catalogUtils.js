import { EXEC_ED_TITLE } from '../constants';

/* eslint-disable import/prefer-default-export */
const nowDate = new Date(Date.now());

function checkSubscriptions(courseAssociatedCatalogs) {
  const inBusiness = courseAssociatedCatalogs.includes(
    process.env.EDX_FOR_BUSINESS_TITLE,
  );
  if (inBusiness) {
    return 'Included in business catalog';
  }
  return false;
}

function checkAvailability(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (startDate < nowDate && endDate > nowDate) {
    return 'Available now';
  }
  if (startDate > nowDate) {
    return 'Starting soon';
  }
  return '';
}

function convertLearningTypesToFilters(types) {
  return types.reduce((learningFacets, type) => {
    if (type === EXEC_ED_TITLE) {
      learningFacets.push(`"${type}"`);
    } else {
      learningFacets.push(type);
    }
    return learningFacets;
  }, []).join(' OR ');
}

/**
 * Parses an object that accounts for keys with values that is an array.
 * e.g. {'availability': ['Available Now', 'Starting Soon']} will be parsed as
 * 'availability=Available+Now&availability=Starting+Soon'
 *
 * @param Object query parameter with an array of values.
 * @returns A string containing a query string suitable for use in a URL.
 */

function createQueryParams(options) {
  const queryParams = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        queryParams.append(key, item);
      });
      return;
    }
    queryParams.set(key, value);
  });
  return queryParams.toString();
}

export {
  checkAvailability, checkSubscriptions, convertLearningTypesToFilters, createQueryParams,
};
