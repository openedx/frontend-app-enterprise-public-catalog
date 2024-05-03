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
  const defaultResult = {
    ocm_courses: [],
    exec_ed_courses: [],
    programs: [],
  };

  const getXpertResultsWithThreshold = async (taskId, threshold) => {
    try {
      setLoading(true);
      const response = await EnterpriseCatalogAiCurationApiService.getXpertResults(taskId, threshold);
      const { status, data: responseData, error: responseError } = response;

      if (status >= 400 && status < 600) {
        setError(responseError || responseData?.error);
        setXpertResultsData({});
      } else {
        setXpertResultsData(responseData.result || defaultResult);
      }
    } catch (err) {
      setError(err);
      logError(err);
      setXpertResultsData({});
    } finally {
      setLoading(false);
    }
  };

  return {
    loading, error, xpertResultsData, getXpertResultsWithThreshold,
  };
};
