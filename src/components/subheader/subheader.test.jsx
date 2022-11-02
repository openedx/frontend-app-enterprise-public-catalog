import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Subheader from './subheader';

jest.mock('@edx/frontend-platform/analytics');

const text = 'Some nice copy';
const props = {
  title: 'ACTION NEEDED',
};

describe('callToAction', () => {
  it('renders the text passed to it', () => {
    render(
      <Subheader {...props}>
        <p>{text}</p>
      </Subheader>,
    );
    // getByText will error if title is not in the document.
    screen.getByText(props.title);
    screen.getByText(text);
  });
});
