import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import { sendTrackEvent } from '@edx/frontend-platform/analytics';

import Subheader from './subheader';
import { PRODUCT_EVENTS } from '../../constants';

jest.mock('@edx/frontend-platform/analytics');

const text = 'Some nice copy';
const props = {
  title: 'ACTION NEEDED',
};

describe('callToAction', () => {
  it('renders the text passed to it', () => {
    render(<Subheader {...props}><p>{text}</p></Subheader>);
    // getByText will error if title is not in the document.
    screen.getByText(props.title);
    screen.getByText(text);
  });
});
