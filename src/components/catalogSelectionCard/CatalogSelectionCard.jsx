import React, {
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { SearchContext, deleteRefinementAction, setRefinementAction } from '@edx/frontend-enterprise';
import {
  Card, Form,
} from '@edx/paragon';
import { QUERY_UUID_REFINEMENT } from '../../constants';

export const CardCheckbox = ({ label, queryUuid }) => {
  const { refinementsFromQueryParams, dispatch } = useContext(SearchContext);
  const isChecked = refinementsFromQueryParams[QUERY_UUID_REFINEMENT]?.includes(queryUuid) || false;
  const setChecked = () => {
    if (isChecked) {
      dispatch(deleteRefinementAction(QUERY_UUID_REFINEMENT));
    } else {
      dispatch(setRefinementAction(QUERY_UUID_REFINEMENT, [queryUuid]));
    }
  };
  return (
    <Form.Checkbox className="catalog-selection-card" checked={isChecked} onChange={setChecked}>{label}</Form.Checkbox>
  );
};

CardCheckbox.propTypes = {
  queryUuid: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const CatalogSelectionCard = ({ queryUuid, label, cardBody }) => (
  <Card>
    <Card.Body>
      <Card.Title>
        <CardCheckbox label={label} queryUuid={queryUuid} />
      </Card.Title>
      <Card.Text>{cardBody}</Card.Text>
    </Card.Body>
  </Card>
);

CatalogSelectionCard.propTypes = {
  cardBody: PropTypes.string.isRequired,
  queryUuid: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default CatalogSelectionCard;
