import { Container } from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';

function Subheader({ title, children }) {
  return (
    <section>
      <Container size="xl" className="my-5">
        <div className="lead">
          {title && <h2>{title}</h2>}
          <div>{children}</div>
        </div>
      </Container>
    </section>
  );
}

Subheader.defaultProps = {
  title: null,
};

Subheader.propTypes = {
  title: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
};

export default Subheader;
