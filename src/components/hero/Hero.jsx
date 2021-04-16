import {
  ExtraLarge, Image, Large, Container,
} from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import SmallHeroImageLoRes from '../../assets/hero-image-small-lo-res.png';
import LargeHeroImageLoRes from '../../assets/hero-image-large-lo-res.png';
import SmallHeroImageHiRes from '../../assets/hero-image-hi-res.png';
import LargeHeroImageHiRes from '../../assets/hero-image-144px-hi-res.png';
import { Highlighted } from '../helperComponents';
import messages from './Hero.messages';

const IMAGE_WRAPPER_CLASS = 'hero__image-wrapper';
const IMAGE_CLASS = 'hero__image';

const Hero = ({ intl, text, highlight }) => (
  <section className="hero">
    <Container size="lg" className="hero__content">
      <h1 className="display-3"><Highlighted text={text} highlight={highlight} /></h1>
      <div>
        <Large className={IMAGE_WRAPPER_CLASS}>
          <Image
            className={IMAGE_CLASS}
            srcSet={`${SmallHeroImageLoRes} 1000w, ${SmallHeroImageHiRes} 2000w`}
            src={SmallHeroImageLoRes}
            alt={intl.formatMessage(messages['hero.image.alt'])}
            size="33vw"
          />
        </Large>
        <ExtraLarge className={IMAGE_WRAPPER_CLASS}>
          <Image
            className={IMAGE_CLASS}
            srcSet={`${LargeHeroImageLoRes} 1000w, ${LargeHeroImageHiRes} 2000w`}
            src={LargeHeroImageLoRes}
            alt={intl.formatMessage(messages['hero.image.alt'])}
            size="33vw"
          />
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
