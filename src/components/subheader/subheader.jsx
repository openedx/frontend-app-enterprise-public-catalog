import {
  Container,
} from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';

const Subheader = ({
  title, children,
}) => (
  <section>
    <Container className="subtitle" size="lg">
      <div className="subtitle__text">
        {title && <h2 className="subtitle__title">{title}</h2>}
        <div>{children}</div>
      </div>
    </Container>
  </section>
);

Subheader.defaultProps = {
  title: null,
};

Subheader.propTypes = {
  title: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
};

export default Subheader;
