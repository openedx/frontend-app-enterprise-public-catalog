import {
  Button, Container,
} from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';

const CallToAction = ({
  title, text, buttonText, buttonLink,
}) => (
  <section>
    <Container className="cta" size="lg">
      <div className="cta__text">
        {title && <h2 className="cta__title">{title}</h2>}
        <div>{text}</div>
      </div>
      <div className="cta__button">
        <Button variant="brand" href={buttonLink}>{buttonText}</Button>
      </div>
    </Container>
  </section>
);

CallToAction.defaultProps = {
  title: null,
};

CallToAction.propTypes = {
  title: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonLink: PropTypes.string.isRequired,
};

export default CallToAction;
