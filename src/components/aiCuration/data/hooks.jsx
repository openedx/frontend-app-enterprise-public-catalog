import { useState, useEffect, useRef } from 'react';
import { logError } from '@edx/frontend-platform/logging';
import EnterpriseCatalogAiCurationApiService from './service';

export default function useInterval(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest callback function
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const useXpertResultsWithThreshold = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [xpertResultsData, setXpertResultsData] = useState([]);

  const getXpertResultsWithThreshold = async (taskId, threshold) => {
    try {
      setLoading(true);
      const results = await EnterpriseCatalogAiCurationApiService.getXpertResults(taskId, threshold);
      const { status, data: responseData, error: responseError } = results;

      if (status >= 400 && status < 600) {
        setError(responseError);
        setXpertResultsData([]);
      } else {
        setXpertResultsData(responseData || []);
      }
    } catch (err) {
      setError(err);
      logError(err);
      setXpertResultsData([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading, error, xpertResultsData, getXpertResultsWithThreshold,
  };
};
