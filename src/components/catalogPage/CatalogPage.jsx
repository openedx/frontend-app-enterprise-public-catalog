import React from 'react';
import { EnterpriseCatalogs } from '../catalogs';
import Hero from '../hero/Hero';
import CallToAction from '../callToAction/callToAction';

const ctaText = 'Explore comprehensive course catalogs curated for businesses and for educational institutions,'
  + 'or work with an edX representative to customize a solution for your unique needs.';
export const heroText = 'Tailored learning for your team';
export const ctaButtonText = 'Schedule a call';
const ctaButtonLink = 'https://business.edx.org/schedule';

const CatalogPage = () => (
  <main>
    <Hero
      text={heroText}
    />
    <CallToAction
      text={ctaText}
      buttonText={ctaButtonText}
      buttonLink={ctaButtonLink}
    />
    <EnterpriseCatalogs />
  </main>
);

export default CatalogPage;
