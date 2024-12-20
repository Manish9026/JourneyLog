import { useState, useEffect } from "react";
import { debounce } from "../utils/optimization";

const useSticky = (threshold = 100, debounceDelay = 50) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > threshold);
    }, debounceDelay);

    window.addEventListener("scroll", handleScroll);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold, debounceDelay]);

  return isSticky;
};

export default useSticky;
