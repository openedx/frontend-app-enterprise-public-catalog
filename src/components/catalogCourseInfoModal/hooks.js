import { useState, useEffect } from 'react';
import fetchProgramInfo from '../../data/services/DiscoveryAPIService';

const useProgramInfo = (programUuid) => {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetcher = async () => {
      const dataResponse = await fetchProgramInfo(programUuid);
      setData(dataResponse);
    };
    fetcher().catch(err => console.error(err));
  }, [programUuid]);
  return data;
};

export default useProgramInfo;
