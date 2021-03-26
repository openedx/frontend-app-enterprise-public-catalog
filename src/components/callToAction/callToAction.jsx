import {
  Button, ExtraLarge, Image, Large,
} from '@edx/paragon';
import React from 'react';
import { paddingClasses } from '../constants';

const CallToAction = ({ title, text }) => (
  <div className={`cta py-5 py-md-4 ${paddingClasses}`}>
    <div className="cta__text">
      <h2 className="h4">{title}</h2>
      <p>{text}</p>
    </div>
    <div className="cta__button ml-0 ml-md-5">
      <Button variant="brand">Schedule a call</Button>
    </div>
  </div>
);

export default CallToAction;
