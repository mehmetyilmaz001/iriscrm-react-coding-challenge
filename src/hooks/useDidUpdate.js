import { useRef, useEffect } from 'react';

const useDidUpdate = (callback, deps) => {
    const hasMount = useRef(false);
  
    useEffect(() => {
      if (hasMount.current) {
        callback();
      } else {
        hasMount.current = true;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };


  export default useDidUpdate;