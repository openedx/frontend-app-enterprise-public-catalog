export function getSelectedCatalogFromURL() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return (params.enterprise_catalog_query_titles);
}

export function formatDate(courseRun) {
  if (courseRun) {
    if (courseRun.start && courseRun.end) {
      const startDate = (new Date(courseRun.start)).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
      const endDate = (new Date(courseRun.end)).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${startDate} - ${endDate}`;
    }
  }
  return null;
}

export function makePlural(num, string) {
  if (num > 1 || num === 0) { return (`${num} ${string}s`); }
  return (`${num} ${string}`);
}

export function getCourses(numCourses, string) {
  if (numCourses === 0) {
    return 'Courses available upon enrollment';
  }
  if (numCourses > 1) {
    return (`${numCourses} ${string}s`);
  }

  return (`${numCourses} ${string}`);
}
