import { useState, useEffect } from 'react';

/* A hook to listen to scroll and resize events and 
   to return an element's position and the window's width */
const listenToScrollResize = (elementRef) => {

  const getPosition = () => {
    return {
      y: elementRef.current ? elementRef.current.getBoundingClientRect().top : undefined,
      x: elementRef.current ? elementRef.current.getBoundingClientRect().left : undefined,
      width: window.innerWidth,
    };
  };
  
  const [newPosition, setNewPosition] = useState(getPosition);
  
  useEffect(() => {
    if (!elementRef.current) {
      return false;
    }
    const handleChange = () => {
      setNewPosition(getPosition());
    };
    window.addEventListener('scroll', handleChange);
    window.addEventListener('resize', handleChange);
    return () => {
      window.removeEventListener('scroll', handleChange);
      window.removeEventListener('resize', handleChange);
    };
  }, []);
  
  return newPosition;
};

export default listenToScrollResize;