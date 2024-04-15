import React, { useEffect, useState } from 'react';
import {
  ProgressBar,
} from '@edx/paragon';
import PropTypes from 'prop-types';

const LoadingBar = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;

    if (isLoading) {
      interval = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress >= 90) { return 90; }
          return Math.min(prevProgress + Math.floor(Math.random() * 5) + 1, 100);
        });
      }, 200); // Adjust the interval duration for smoother or faster loading
    } else {
      // Clear the interval when loading becomes false
      clearInterval(interval);
      setProgress(0);
    }

    return () => clearInterval(interval); // Cleanup interval
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
