import React from 'react';
import { Hyperlink } from '@edx/paragon';
import { EnterpriseCatalogs } from '../catalogs';
import Hero from '../hero/Hero';
import CallToAction from '../callToAction/callToAction';

export const heroText = 'Tailored learning for your team';
export const ctaButtonText = 'Schedule a call';
const ctaButtonLink = 'https://business.edx.org/schedule';

const CatalogPage = () => (
  <main>
    <Hero
      text={heroText}
      highlight="Tailored learning"
    />
    <CallToAction
      buttonText={ctaButtonText}
      buttonLink={ctaButtonLink}
      highlighted="for businesses"
    >
      <span>Explore comprehensive course catalogs curated <Hyperlink destination="https://business.edx.org">for businesses</Hyperlink> and <Hyperlink destination="https://campus.edx.org">for educational institutions</Hyperlink>,
        or work with an edX representative to customize a solution for your unique needs.
      </span>
    </CallToAction>
    <EnterpriseCatalogs />
  </main>
);

export default CatalogPage;
