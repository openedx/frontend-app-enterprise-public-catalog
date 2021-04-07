/* eslint-disable react/prop-types */
import { screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { renderWithRouter } from '../../tests/testUtils';
import { EnterpriseCatalogsApp } from '../App';
import { NOT_FOUND_TEXT } from '../../NotFoundPage';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendPageEvent: jest.fn(),
}));

jest.mock('@edx/frontend-platform/auth');
getAuthenticatedUser.mockReturnValue({ username: 'test-username' });

// all we are testing is routes, we don't care what's rendered as long as it's the right page
jest.mock('react-instantsearch-dom', () => ({
  ...jest.requireActual('react-instantsearch-dom'),
  InstantSearch: () => (<div>SEARCH</div>),
}));

const mockConfig = () => (
  {
    ENTERPRISE_MARKETING_URL: 'http://apptest.com',
  }
);

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: () => mockConfig(),
}));

/**
 * Rationale of test: Render the main EnterpriseCatalogsApp excluding the AppProvider (which is
 * what App does)
 * Test that routes render correctly
 * This means we can inject fake data into AppProvider
 */

describe('app routes', () => {
  test('/ renders the EnterpriseCatalogs component', () => {
    renderWithRouter(<EnterpriseCatalogsApp />);
    // we are good if the table renders
    expect(screen.getByText('SEARCH')).toBeInTheDocument();
  });
  test('all other routes render the NotFoundPage component', () => {
    renderWithRouter(<EnterpriseCatalogsApp />, { route: '/something-else' });
    // ensure the not found page renders instead
    expect(screen.getByText(NOT_FOUND_TEXT)).toBeInTheDocument();
  });
});
