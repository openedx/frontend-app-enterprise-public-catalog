import {
  ExtraLarge, Image, Large, Container,
} from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';
import SmallHeroImage from '../../assets/hero-image-cluster-1x.png';
import LargeHeroImage from '../../assets/hero-image-cluster-2x.png';

const imageAltText = 'People learning and performing highly skilled tasks';

export const FirstWordHighlighter = ({ text }) => {
  const words = text.split(' ');
  const firstWord = words.shift();
  return <span className="word-splitter"><div className="highlighted">{`${firstWord} `}</div><div>{words.join(' ')}</div></span>;
};

FirstWordHighlighter.propTypes = {
  text: PropTypes.string.isRequired,
};

const Hero = ({ text }) => (
  <section className="hero">
    <Container size="lg" className="hero__content">
      <h1 className="display-3"><FirstWordHighlighter text={text} /></h1>
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

Hero.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Hero;
