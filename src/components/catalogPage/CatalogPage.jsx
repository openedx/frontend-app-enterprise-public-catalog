import React from 'react';
import { EnterpriseCatalogs } from '../catalogs';
import Hero from '../hero/Hero';
import CallToAction from '../callToAction/callToAction';
import { Highlighted } from '../helperComponents';

const ctaText = 'Explore comprehensive course catalogs curated for businesses and for educational institutions,'
  + 'or work with an edX representative to customize a solution for your unique needs.';
export const heroText = 'Tailored learning for your team';
export const ctaButtonText = 'Schedule a call';
const ctaButtonLink = 'https://business.edx.org/schedule';

const CatalogPage = () => (
  <main>
    <Hero
      text={heroText}
      highlight="Tailored"
    />
    <CallToAction
      text={ctaText}
      buttonText={ctaButtonText}
      buttonLink={ctaButtonLink}
      highlighted="for businesses"
    >
      <Highlighted
        text="Explore comprehensive course catalogs curated for businesses "
        highlight="for businesses"
        highlightClass="info"
      />
      <Highlighted
        text="and for educational institutions, or work with an edX representative to customize a solution for your unique needs."
        highlight="for educational institutions"
        highlightClass="info"
      />
    </CallToAction>
    <EnterpriseCatalogs />
  </main>
);

export default CatalogPage;
