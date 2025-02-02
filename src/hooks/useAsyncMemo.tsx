import { useEffect, useState, useMemo } from "react";

type fd = ()=>any;

export const useAsyncMemo = (fetchData: fd, initialData: any, dependencies: any[]|undefined)=> {
    const [data, setData] = useState(initialData);

    useEffect(() => {
      let isMounted = true;
  
      const fetchDataAsync = async () => {
        const result = await fetchData();
        if (isMounted) setData(result);
      };
  
      fetchDataAsync();
  
      return () => {
        isMounted = false;
      };
    }, dependencies);
  
    return useMemo(() => data, [data]);  
}