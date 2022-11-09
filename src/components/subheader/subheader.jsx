import { Container } from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';

const Subheader = ({ title, children }) => (
  <section>
    <Container className="my-5 page-width">
      <div className="lead">
        {title && <h2>{title}</h2>}
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
