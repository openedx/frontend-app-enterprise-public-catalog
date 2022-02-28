import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  SearchContext, setRefinementAction,
} from '@edx/frontend-enterprise-catalog-search';
import { Badge, Card, Form } from '@edx/paragon';
import { QUERY_TITLE_REFINEMENT } from '../../constants';

export const CardCheckbox = ({ queryTitle }) => {
  const { refinements, dispatch } = useContext(SearchContext);
  const isChecked =
    refinements[QUERY_TITLE_REFINEMENT]?.includes(queryTitle) || false;

  const setChecked = () => {
    if (!isChecked) {
      dispatch(setRefinementAction(QUERY_TITLE_REFINEMENT, [queryTitle]));
    }
  };
  return (
    <Form.Radio
      className="mt-3 mr-3"
      checked={isChecked}
      onChange={setChecked}
    >
    </Form.Radio>
  );
};

CardCheckbox.propTypes = {
  queryTitle: PropTypes.string.isRequired,
};

const CatalogSelectionCard = ({
  queryTitle,
  className,
  badgeVariant,
  badge,
  label,
  cardBody,
  labelDetail,
}) => (
  <Card>
    <Card.Header
      title={
        <span>
          <Badge className={className} variant={badgeVariant}>
            {badge}
          </Badge>
          <div>{label}</div>
        </span>
      }
      subtitle={labelDetail}
      actions={<CardCheckbox queryTitle={queryTitle} />}
    />
    <Card.Section>{cardBody}</Card.Section>
  </Card>
);

CatalogSelectionCard.defaultProps = {
  className: "",
};

CatalogSelectionCard.propTypes = {
  className: PropTypes.string,
  badgeVariant: PropTypes.string.isRequired,
  badge: PropTypes.string.isRequired,
  cardBody: PropTypes.string.isRequired,
  queryTitle: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelDetail: PropTypes.string.isRequired,
};

export default CatalogSelectionCard;
