import React, { useEffect, useState } from 'react';
import {
  ProgressBar,
} from '@openedx/paragon';
import PropTypes from 'prop-types';
import { progressBarDuration, targetProgressBarValue } from '../../constants';

const LoadingBar = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    const stepTime = progressBarDuration / targetProgressBarValue; // Time per percentage point

    if (isLoading) {
      interval = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress >= targetProgressBarValue) {
            clearInterval(interval);
            return targetProgressBarValue;
          }
          return prevProgress + 1;
        });
      }, stepTime);
    } else {
      clearInterval(interval);
      setProgress(0);
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [isLoading]);
  return (
    <div>
      <ProgressBar variant="info" now={progress} />
    </div>
  );
};

LoadingBar.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default LoadingBar;
