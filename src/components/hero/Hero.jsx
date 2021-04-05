import {
  ExtraLarge, Image, Large, Container,
} from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import SmallHeroImage from '../../assets/hero-image-cluster-1x.png';
import LargeHeroImage from '../../assets/hero-image-cluster-2x.png';
import { Highlighted } from '../helperComponents';
import messages from './Hero.messages';

const Hero = ({ intl, text, highlight }) => (
  <section className="hero">
    <Container size="lg" className="hero__content">
      <h1 className="display-3"><Highlighted text={text} highlight={highlight} /></h1>
      <div>
        <Large>
          <Image className="hero__image" src={SmallHeroImage} alt={intl.formatMessage(messages['hero.image.alt'])} />
        </Large>
        <ExtraLarge>
          <Image className="hero__image" src={LargeHeroImage} alt={intl.formatMessage(messages['hero.image.alt'])} />
        </ExtraLarge>
      </div>
    </Container>
  </section>
);

Hero.defaultProps = {
  highlight: '',
};

Hero.propTypes = {
  intl: intlShape.isRequired,
  text: PropTypes.string.isRequired,
  highlight: PropTypes.string,
};

export default injectIntl(Hero);
