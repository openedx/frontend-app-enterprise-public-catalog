import { Button } from '@openedx/paragon';
import PropTypes from 'prop-types';
import React from 'react';

const TitleButton = ({ row, onClick }) => (
  <Button className="text-left" variant="link" onClick={() => onClick(row)}>
    {row.values.title}
  </Button>
);

TitleButton.propTypes = {
  row: PropTypes.shape({
    values: PropTypes.shape({
      title: PropTypes.string,
    }),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TitleButton;
