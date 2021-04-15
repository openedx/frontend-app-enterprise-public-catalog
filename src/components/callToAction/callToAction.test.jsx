import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import { sendTrackEvent } from '@edx/frontend-platform/analytics';

import CallToAction from './callToAction';
import { PRODUCT_EVENTS } from '../../constants';

jest.mock('@edx/frontend-platform/analytics');

const text = 'Some nice copy';
const props = {
  title: 'ACTION NEEDED',
  buttonLink: 'http://buyme.com',
  buttonText: 'Buy Now',
};

describe('callToAction', () => {
  it('renders the text passed to it', () => {
    render(<CallToAction {...props}><p>{text}</p></CallToAction>);
    // getByText will error if title is not in the document.
    screen.getByText(props.title);
    screen.getByText(text);
  });
  it('renders a button with a link', () => {
    render(<CallToAction {...props}><p>{text}</p></CallToAction>);
    const button = screen.getByText(props.buttonText);
    expect(button).toHaveAttribute('href', props.buttonLink);
  });
  it('fires correct tracking event on button click', () => {
    render(<CallToAction {...props}><p>{text}</p></CallToAction>);
    const button = screen.getByText(props.buttonText);
    userEvent.click(button);
    expect(sendTrackEvent).toHaveBeenCalledWith(PRODUCT_EVENTS.ctaButtonPressed);
  });
});
