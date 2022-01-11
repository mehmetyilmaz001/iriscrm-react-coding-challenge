import { useEffect, useState } from "react";


const useScrollPosition = (element) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollHeight, setScrollHeight] = useState(0);
  
    useEffect(() => {
      const updatePosition = () => {
        setScrollPosition(element.scrollTop);
        setScrollHeight(element.offsetHeight);

        // setScrollPosition(window.pageYOffset);
      }
      if(element){
        element.addEventListener("scroll", updatePosition);
        updatePosition();
        return () => element.removeEventListener("scroll", updatePosition);
      }
    }, [element]);
  
    return {scrollPosition, scrollHeight};
  };
  
  export default useScrollPosition;