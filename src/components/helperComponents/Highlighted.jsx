import React from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'lodash.escaperegexp';
import classNames from 'classnames';

const Highlighted = ({ text, highlight, highlightClass }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts
        .filter((part) => part)
        .map((part, i) => (regex.test(part) ? (
          <span
            className={classNames('highlighted', highlightClass)}
            key={highlightClass}
          >
            {part}
          </span>
        ) : (
        // eslint-disable-next-line react/no-array-index-key
          <span key={i}>{part}</span>
        )))}
    </>
  );
};

Highlighted.defaultProps = {
  text: '',
  highlight: '',
  highlightClass: '',
};

Highlighted.propTypes = {
  text: PropTypes.string,
  highlight: PropTypes.string,
  highlightClass: PropTypes.string,
};

export default Highlighted;
