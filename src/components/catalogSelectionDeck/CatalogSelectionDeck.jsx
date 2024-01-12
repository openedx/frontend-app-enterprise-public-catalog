import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getConfig } from '@edx/frontend-platform/config';
import {
  SearchContext,
  setRefinementAction,
} from '@edx/frontend-enterprise-catalog-search';
import {
  breakpoints, Container, SelectableBox, useMediaQuery,
} from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './CatalogSelectionDeck.messages';
import { QUERY_TITLE_REFINEMENT } from '../../constants';

const CatalogSelectionDeck = ({ intl, title, hide }) => {
  const { refinements, dispatch } = useContext(SearchContext);
  const config = getConfig();
  const [value, setValue] = useState('');
  const handleChange = e => {
    dispatch(setRefinementAction(QUERY_TITLE_REFINEMENT, [e.target.value]));
    setValue(e.target.value);
  };
  const isExtraSmall = useMediaQuery({ maxWidth: breakpoints.extraSmall.maxWidth });

  useEffect(() => {
    if (refinements[QUERY_TITLE_REFINEMENT]) {
      setValue(refinements[QUERY_TITLE_REFINEMENT][0]);
    }
  }, [refinements]);

  return (
    <Container size="xl" className={classNames({ 'd-none': hide })}>
      <h2>{title}</h2>
      <SelectableBox.Set
        name="catalog-selection"
        type="radio"
        value={value}
        onChange={handleChange}
        columns={isExtraSmall ? 1 : 2}
        className="py-4"
      >
        <SelectableBox value={config.EDX_ENTERPRISE_ALACARTE_TITLE} inputHidden={false} type="radio" aria-label="a la carte select">
          <div>
            <h3>{intl.formatMessage(messages['catalogSelectionDeck.aLaCarte.label'])}</h3>
            <p>{intl.formatMessage(messages['catalogSelectionDeck.aLaCarte.labelDetail'])}</p>
            <ul className="catalog-list">
              <li>{intl.formatMessage(messages['catalogSelectionDeck.aLaCarte.bullet1'])}</li>
              <li>{intl.formatMessage(messages['catalogSelectionDeck.aLaCarte.bullet2'])}</li>
            </ul>
          </div>
        </SelectableBox>
        <SelectableBox value={config.EDX_FOR_BUSINESS_TITLE} inputHidden={false} type="radio" aria-label="business select">
          <h3>{intl.formatMessage(messages['catalogSelectionDeck.edxSubscription.label'])}</h3>
          <p>{intl.formatMessage(messages['catalogSelectionDeck.labelDetail'])}</p>
          <ul className="catalog-list">
            <li>{intl.formatMessage(messages['catalogSelectionDeck.bullet1'])}</li>
            <li>{intl.formatMessage(messages['catalogSelectionDeck.bullet2'])}</li>
            <li>{intl.formatMessage(messages['catalogSelectionDeck.bullet3'])}</li>
          </ul>
        </SelectableBox>
      </SelectableBox.Set>
    </Container>
  );
};

CatalogSelectionDeck.defaultProps = {
  hide: false,
};

CatalogSelectionDeck.propTypes = {
  title: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  hide: PropTypes.bool,
};

export default injectIntl(CatalogSelectionDeck);
