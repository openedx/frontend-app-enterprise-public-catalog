import { Button } from '@edx/paragon';
import PropTypes from 'prop-types';
import React from 'react';

function TitleButton({ row, onClick }) {
  return (
    <Button className="text-left" variant="link" onClick={() => onClick(row)}>
      {row.values.title}
    </Button>
  );
}

TitleButton.propTypes = {
  row: PropTypes.shape({
    values: PropTypes.shape({
      title: PropTypes.string,
    }),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TitleButton;
