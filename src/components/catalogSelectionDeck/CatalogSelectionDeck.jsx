import React, { useContext, useEffect, useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import {
  SearchContext,
  setRefinementAction,
} from '@edx/frontend-enterprise-catalog-search';
import {
  Badge, breakpoints, Container, SelectableBox, useMediaQuery,
} from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import messages from './CatalogSelectionDeck.messages';
import { QUERY_TITLE_REFINEMENT } from '../../constants';

function CatalogSelectionDeck({ intl, title, hide }) {
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
    <Container className="page-width" style={{ display: hide ? 'none' : 'block' }}>
      <h2>{title}</h2>
      <SelectableBox.Set
        name="catalog-selection"
        type="radio"
        value={value}
        onChange={handleChange}
        columns={isExtraSmall ? 1 : 3}
        className="py-4"
      >
        <SelectableBox value={config.EDX_ENTERPRISE_ALACARTE_TITLE} inputHidden={false} type="radio" aria-label="radio">
          <div>
            <Badge variant="dark">
              {intl.formatMessage(messages['catalogSelectionDeck.aLaCarte.badge'])}
            </Badge>
            <h3>{intl.formatMessage(messages['catalogSelectionDeck.aLaCarte.label'])}</h3>
            <p>{intl.formatMessage(messages['catalogSelectionDeck.aLaCarte.labelDetail'])}</p>
            <ul className="catalog-list">
              <li>{intl.formatMessage(messages['catalogSelectionDeck.aLaCarte.bullet1'])}</li>
              <li>{intl.formatMessage(messages['catalogSelectionDeck.aLaCarte.bullet2'])}</li>
            </ul>
          </div>
        </SelectableBox>
        <SelectableBox value={config.EDX_FOR_BUSINESS_TITLE} inputHidden={false} type="radio" aria-label="radio">
          <Badge variant="secondary">
            {intl.formatMessage(messages['catalogSelectionDeck.edxForBusiness.badge'])}
          </Badge>
          <h3>{intl.formatMessage(messages['catalogSelectionDeck.edxForBusiness.label'])}</h3>
          <p>{intl.formatMessage(messages['catalogSelectionDeck.labelDetail'])}</p>
          <ul className="catalog-list">
            <li>{intl.formatMessage(messages['catalogSelectionDeck.bullet1'])}</li>
            <li>{intl.formatMessage(messages['catalogSelectionDeck.bullet2'])}</li>
            <li>{intl.formatMessage(messages['catalogSelectionDeck.bullet3'])}</li>
          </ul>
        </SelectableBox>
        <SelectableBox value={config.EDX_FOR_ONLINE_EDU_TITLE} inputHidden={false} type="radio" aria-label="radio">
          <Badge variant="light">
            {intl.formatMessage(messages['catalogSelectionDeck.edxForOnlineEdu.badge'])}
          </Badge>
          <h3>{intl.formatMessage(messages['catalogSelectionDeck.edxForOnlineEdu.label'])}</h3>
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
}

CatalogSelectionDeck.defaultProps = {
  hide: false,
};

CatalogSelectionDeck.propTypes = {
  title: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  hide: PropTypes.bool,
};

export default injectIntl(CatalogSelectionDeck);
