/* eslint-disable import/prefer-default-export */
const nowDate = new Date(Date.now());

function checkSubscriptions(courseAssociatedCatalogs) {
  const inBusiness = courseAssociatedCatalogs.includes(process.env.EDX_FOR_BUSINESS_TITLE);
  const inEducation = courseAssociatedCatalogs.includes(process.env.EDX_FOR_ONLINE_EDU_TITLE);
  if (inBusiness && inEducation) { return 'Included in education and business catalog'; }
  if (inBusiness) { return 'Included in business catalog'; }
  if (inEducation) { return 'Included in education catalog'; }
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

export { checkAvailability, checkSubscriptions };
