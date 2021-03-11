import React from 'react';
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import PageWrapper, { DATA_TEST_ID } from '../PageWrapper';

describe('PageWrapper rendering', () => {
  test('PageWrapper renders successfully', () => {
    render(<PageWrapper><div>a child</div></PageWrapper>);
    expect(screen.getByText('a child')).toBeInTheDocument();
    expect(screen.getByTestId(DATA_TEST_ID)).toBeInTheDocument();
  });
});
