import { useState, useEffect } from 'react';

/* A hook to listen to scroll, resize and click events and 
   to return an element's position and the window's width */
const listenToScrollResizeClick = (elementRef) => {

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
    elementRef.current.addEventListener('click', handleChange);
    return () => {
      window.removeEventListener('scroll', handleChange);
      window.removeEventListener('resize', handleChange);
      if (elementRef.current) {
        elementRef.current.removeEventListener('click', handleChange);
      }
    };
  }, []);
  
  return newPosition;
};

export default listenToScrollResizeClick;