import {
  Button, Container,
} from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { PRODUCT_EVENTS } from '../../constants';

const { ctaButtonPressed } = PRODUCT_EVENTS;
const handleClick = () => {
  sendTrackEvent(ctaButtonPressed);
};

const CallToAction = ({
  title, buttonText, buttonLink, children,
}) => (
  <section>
    <Container className="cta" size="lg">
      <div className="cta__text">
        {title && <h2 className="cta__title">{title}</h2>}
        <div>{children}</div>
      </div>
      <div className="cta__button">
        <Button onClick={handleClick} variant="brand" href={buttonLink}>{buttonText}</Button>
      </div>
    </Container>
  </section>
);

CallToAction.defaultProps = {
  title: null,
};

CallToAction.propTypes = {
  title: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonLink: PropTypes.string.isRequired,
};

export default CallToAction;
