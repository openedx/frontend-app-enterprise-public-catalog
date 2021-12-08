import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Container, ExtraExtraLarge, ExtraLarge, ExtraSmall, Image, Large, Medium, Small,
} from '@edx/paragon';
import PropTypes from 'prop-types';
import React from 'react';
import LargeHeroImageHiRes from '../../assets/hero-image-144px-hi-res.png';
import SmallHeroImageHiRes from '../../assets/hero-image-hi-res.png';
import LargeHeroImageLoRes from '../../assets/hero-image-large-lo-res.png';
import SmallHeroImageLoRes from '../../assets/hero-image-small-lo-res.png';
import { Highlighted } from '../helperComponents';
import messages from './Hero.messages';

const IMAGE_CLASS = 'hero__image';

const SmallImage = ({ alt }) => (
  <Image
    className={IMAGE_CLASS}
    srcSet={`${SmallHeroImageLoRes} 1000w, ${SmallHeroImageHiRes} 2000w`}
    src={SmallHeroImageLoRes}
    alt={alt}
    sizes="23vw"
  />
);
SmallImage.propTypes = {
  alt: PropTypes.string.isRequired,
};

const LargeImage = ({ alt }) => (
  <Image
    className={IMAGE_CLASS}
    srcSet={`${LargeHeroImageLoRes} 1000w, ${LargeHeroImageHiRes} 2000w`}
    src={LargeHeroImageLoRes}
    alt={alt}
    sizes="33vw"
  />
);
LargeImage.propTypes = {
  alt: PropTypes.string.isRequired,
};

const Hero = ({ intl, text, highlight }) => {
  const alt = intl.formatMessage(messages['hero.image.alt']);
  return (
    <section className="hero">
      <Container size="lg" className="hero__content">
        <h1 className="display-1"><Highlighted text={text} highlight={highlight} /></h1>
        <div>
          <Large>
            <SmallImage alt={alt} />
          </Large>
          <Medium>
            <SmallImage alt={alt} />
          </Medium>
          <ExtraExtraLarge>
            <LargeImage alt={alt} />
          </ExtraExtraLarge>
          <ExtraLarge>
            <LargeImage alt={alt} />
          </ExtraLarge>
        </div>
      </Container>
    </section>
  );
};

Hero.defaultProps = {
  highlight: '',
};

Hero.propTypes = {
  intl: intlShape.isRequired,
  text: PropTypes.string.isRequired,
  highlight: PropTypes.string,
};

export default injectIntl(Hero);
