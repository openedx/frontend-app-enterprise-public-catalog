import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getConfig } from '@edx/frontend-platform/config';
import {
  SearchContext,
  setRefinementAction,
} from '@edx/frontend-enterprise-catalog-search';
import {
  Badge, breakpoints, Container, SelectableBox, useMediaQuery,
} from '@openedx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './CatalogSelectionDeck.messages';
import { QUERY_TITLE_REFINEMENT } from '../../constants';
import features from '../../config';

const CatalogSelectionDeck = ({ intl, title, hide }) => {
  const { refinements, dispatch } = useContext(SearchContext);
  const config = getConfig();
  const [value, setValue] = useState('');
  const handleChange = e => {
    dispatch(setRefinementAction(QUERY_TITLE_REFINEMENT, [e.target.value]));
    setValue(e.target.value);
  };
  const isExtraSmall = useMediaQuery({ maxWidth: breakpoints.extraSmall.maxWidth });
  const columnCount = features.CONSOLIDATE_SUBS_CATALOG ? 2 : 3;

  let businessBadgeMessageKey = 'catalogSelectionDeck.edxForBusiness.badge';
  let businessLabelMessageKey = 'catalogSelectionDeck.edxForBusiness.label';
  if (features.CONSOLIDATE_SUBS_CATALOG) {
    businessBadgeMessageKey = 'catalogSelectionDeck.edxSubscription.badge';
    businessLabelMessageKey = 'catalogSelectionDeck.edxSubscription.label';
  }

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
        columns={isExtraSmall ? 1 : columnCount}
        className="py-4"
      >
        <SelectableBox value={config.EDX_ENTERPRISE_ALACARTE_TITLE} inputHidden={false} type="radio" aria-label="a la carte select">
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
        <SelectableBox value={config.EDX_FOR_BUSINESS_TITLE} inputHidden={false} type="radio" aria-label="business select">
          <Badge variant="secondary">
            {intl.formatMessage(messages[businessBadgeMessageKey])}
          </Badge>
          <h3>{intl.formatMessage(messages[businessLabelMessageKey])}</h3>
          <p>{intl.formatMessage(messages['catalogSelectionDeck.labelDetail'])}</p>
          <ul className="catalog-list">
            <li>{intl.formatMessage(messages['catalogSelectionDeck.bullet1'])}</li>
            <li>{intl.formatMessage(messages['catalogSelectionDeck.bullet2'])}</li>
            <li>{intl.formatMessage(messages['catalogSelectionDeck.bullet3'])}</li>
          </ul>
        </SelectableBox>
        {!features.CONSOLIDATE_SUBS_CATALOG && (
        <SelectableBox value={config.EDX_FOR_ONLINE_EDU_TITLE} inputHidden={false} type="radio" aria-label="education select">
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
        )}
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
