import React, {
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import {
  SearchContext, setRefinementAction,
} from '@edx/frontend-enterprise-catalog-search';
import {
  Card, Form,
} from '@edx/paragon';
import { QUERY_UUID_REFINEMENT } from '../../constants';

export const CardCheckbox = ({
  label, queryUuid, labelDetail,
}) => {
  const { refinementsFromQueryParams, dispatch } = useContext(SearchContext);
  const isChecked = refinementsFromQueryParams[QUERY_UUID_REFINEMENT]?.includes(queryUuid) || false;

  const setChecked = () => {
    if (!isChecked) {
      dispatch(setRefinementAction(QUERY_UUID_REFINEMENT, [queryUuid]));
    }
  };
  return (
    <Form.Radio className="catalog-selection-card" checked={isChecked} onChange={setChecked} description={labelDetail}>{label}</Form.Radio>
  );
};

CardCheckbox.propTypes = {
  queryUuid: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelDetail: PropTypes.string.isRequired,
};

const CatalogSelectionCard = ({
  queryUuid, label, cardBody, labelDetail,
}) => (
  <Card>
    <Card.Body>
      <Card.Title>
        <CardCheckbox
          label={label}
          labelDetail={labelDetail}
          queryUuid={queryUuid}
        />
      </Card.Title>
      <Card.Text>{cardBody}</Card.Text>
    </Card.Body>
  </Card>
);

CatalogSelectionCard.propTypes = {
  cardBody: PropTypes.string.isRequired,
  queryUuid: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelDetail: PropTypes.string.isRequired,
};

export default CatalogSelectionCard;
