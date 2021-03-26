import { ExtraLarge, Image, Large } from '@edx/paragon';
import React from 'react';
import { paddingClasses } from '../constants';
import SmallHeroImage from '../../assets/hero-image-cluster-1x.png';
import LargeHeroImage from '../../assets/hero-image-cluster-2x.png';

const heroText = 'Browse edX courses';
const imageAltText = 'People learning and performing highly skilled tasks';

export const FirstWordHighlighter = ({ text }) => {
  const words = text.split(' ');
  const firstWord = words.shift();
  return <span className="word-splitter"><div className="highlighted">{`${firstWord} `}</div><div>{words.join(' ')}</div></span>;
};

const Hero = ({ text }) => (
  <div className={`hero ${paddingClasses}`}>
    <h1 className="display-3"><FirstWordHighlighter text={heroText} /></h1>
    <div className="hero-image">
      <Large>
        <Image className="hero-image" src={SmallHeroImage} alt={imageAltText} />
      </Large>
      <ExtraLarge>
        <Image className="hero-image" src={LargeHeroImage} alt={imageAltText} />
      </ExtraLarge>
    </div>
  </div>
);

export default Hero;
