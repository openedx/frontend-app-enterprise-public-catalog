import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Container, Image, useMediaQuery, breakpoints,
} from '@openedx/paragon';
import PropTypes from 'prop-types';
import LargeHeroImageHiRes from '../../assets/hero-image-144px-hi-res.jpg';
import SmallHeroImageHiRes from '../../assets/hero-image-hi-res.jpg';
import LargeHeroImageLoRes from '../../assets/hero-image-large-lo-res.jpg';
import SmallHeroImageLoRes from '../../assets/hero-image-small-lo-res.jpg';
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
  />
);
LargeImage.propTypes = {
  alt: PropTypes.string.isRequired,
};

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: breakpoints.large.minWidth });
  return isDesktop ? children : null;
};
Desktop.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      alt: PropTypes.string,
    }),
  }).isRequired,
};
const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({
    minWidth: breakpoints.medium.minWidth,
    maxWidth: breakpoints.medium.maxWidth,
  });
  return isTablet ? children : null;
};
Tablet.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      alt: PropTypes.string,
    }),
  }).isRequired,
};

const Hero = ({ text, highlight }) => {
  const intl = useIntl();
  const alt = intl.formatMessage(messages['hero.image.alt']);

  return (
    <section className="hero">
      <Container size="xl" className="hero__content">
        <Container size="xl" className="hero__text">
          <h1 className="display-1">
            <Highlighted text={text} highlight={highlight} />
          </h1>
        </Container>
        <div className="hero__image__container">
          <LargeImage alt={alt} />
        </div>
      </Container>
    </section>
  );
};

Hero.defaultProps = {
  highlight: '',
};

Hero.propTypes = {
  text: PropTypes.string.isRequired,
  highlight: PropTypes.string,
};

export default Hero;
