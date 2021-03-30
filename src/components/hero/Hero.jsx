import {
  ExtraLarge, Image, Large, Container,
} from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';
import SmallHeroImage from '../../assets/hero-image-cluster-1x.png';
import LargeHeroImage from '../../assets/hero-image-cluster-2x.png';
import { Highlighted } from '../helperComponents';

const imageAltText = 'People learning and performing highly skilled tasks';

const Hero = ({ text, highlight }) => (
  <section className="hero">
    <Container size="lg" className="hero__content">
      <h1 className="display-3"><Highlighted text={text} highlight={highlight} /></h1>
      <div>
        <Large>
          <Image className="hero__image" src={SmallHeroImage} alt={imageAltText} />
        </Large>
        <ExtraLarge>
          <Image className="hero__image" src={LargeHeroImage} alt={imageAltText} />
        </ExtraLarge>
      </div>
    </Container>
  </section>
);

Hero.defaultProps = {
  highlight: '',
};

Hero.propTypes = {
  text: PropTypes.string.isRequired,
  highlight: PropTypes.string,
};

export default Hero;
